use actix_web::{post, get, web, App, HttpResponse, HttpServer, Responder};
use actix_cors::Cors;
use serde::{Deserialize, Serialize};
use sha2::{Sha256, Digest};
use ed25519_dalek::{SigningKey, VerifyingKey, Signature, Signer, Verifier};
use rand::rngs::OsRng;
use std::collections::HashMap;
use std::sync::Mutex;
use hex;

// In-memory key store (for demo only; in production use a proper database)
struct AppState {
    keys: Mutex<HashMap<String, SigningKey>>, // mapping from public key hex -> SigningKey
}

#[derive(Deserialize)]
struct HashRequest {
    content: String,
    reviewer_id: String,
    timestamp: i64,
}

#[derive(Serialize)]
struct HashResponse {
    hash: String,
}

#[post("/hash")]
async fn generate_hash(req: web::Json<HashRequest>) -> impl Responder {
    let input = format!("{}{}{}", req.content, req.reviewer_id, req.timestamp);
    let hash = Sha256::digest(input.as_bytes());
    HttpResponse::Ok().json(HashResponse {
        hash: hex::encode(hash),
    })
}

#[derive(Deserialize)]
struct SignRequest {
    hash: String,
    private_key: String, // hex encoded Ed25519 private key (32 bytes)
}

#[derive(Serialize)]
struct SignResponse {
    signature: String,
}

#[post("/sign")]
async fn sign_hash(req: web::Json<SignRequest>) -> impl Responder {
    // Decode private key from hex
    let private_bytes = match hex::decode(&req.private_key) {
        Ok(bytes) => bytes,
        Err(_) => return HttpResponse::BadRequest().body("Invalid private key hex"),
    };
    let private_array: [u8; 32] = match private_bytes.try_into() {
        Ok(arr) => arr,
        Err(_) => return HttpResponse::BadRequest().body("Private key must be 32 bytes"),
    };
    let signing_key = SigningKey::from_bytes(&private_array);
    let hash_bytes = match hex::decode(&req.hash) {
        Ok(b) => b,
        Err(_) => return HttpResponse::BadRequest().body("Invalid hash hex"),
    };
    let signature = signing_key.sign(&hash_bytes);
    HttpResponse::Ok().json(SignResponse {
        signature: hex::encode(signature.to_bytes()),
    })
}

#[derive(Deserialize)]
struct VerifyRequest {
    hash: String,
    signature: String,
    public_key: String,
}

#[derive(Serialize)]
struct VerifyResponse {
    valid: bool,
}

#[post("/verify")]
async fn verify_signature(req: web::Json<VerifyRequest>) -> impl Responder {
    // Decode public key
    let pub_bytes = match hex::decode(&req.public_key) {
        Ok(b) => b,
        Err(_) => return HttpResponse::BadRequest().body("Invalid public key hex"),
    };
    let verifying_key = match VerifyingKey::from_bytes(&pub_bytes.try_into().unwrap_or([0u8; 32])) {
        Ok(key) => key,
        Err(_) => return HttpResponse::BadRequest().body("Invalid public key"),
    };
    let hash_bytes = match hex::decode(&req.hash) {
        Ok(b) => b,
        Err(_) => return HttpResponse::BadRequest().body("Invalid hash hex"),
    };
    let sig_bytes = match hex::decode(&req.signature) {
        Ok(b) => b,
        Err(_) => return HttpResponse::BadRequest().body("Invalid signature hex"),
    };
    let signature = match Signature::from_bytes(&sig_bytes.try_into().unwrap_or([0u8; 64])) {
        Ok(s) => s,
        Err(_) => return HttpResponse::BadRequest().body("Invalid signature"),
    };
    let valid = verifying_key.verify(&hash_bytes, &signature).is_ok();
    HttpResponse::Ok().json(VerifyResponse { valid })
}

#[get("/health")]
async fn health() -> impl Responder {
    HttpResponse::Ok().json(serde_json::json!({ "status": "ok" }))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    let state = web::Data::new(AppState {
        keys: Mutex::new(HashMap::new()),
    });

    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header()
            .max_age(3600);

        App::new()
            .wrap(cors)
            .app_data(state.clone())
            .service(generate_hash)
            .service(sign_hash)
            .service(verify_signature)
            .service(health)
    })
    .bind("0.0.0.0:3001")?
    .run()
    .await
}
