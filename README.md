afrilance/
├── docker-compose.yml
├── .env.example
├── README.md
├── backend/
│   ├── Dockerfile
│   ├── docker-entrypoint.sh
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       ├── index.ts
│       ├── app.ts
│       ├── config/
│       │   ├── env.ts
│       │   └── database.ts
│       ├── types/
│       │   └── express.d.ts
│       ├── utils/
│       │   ├── bcrypt.ts
│       │   ├── jwt.ts
│       │   ├── keygen.ts
│       │   └── logger.ts
│       ├── middlewares/
│       │   ├── auth.ts
│       │   ├── errorHandler.ts
│       │   └── validation.ts
│       ├── validators/
│       │   ├── auth.ts
│       │   ├── jobs.ts
│       │   └── reviews.ts
│       ├── services/
│       │   ├── auth.service.ts
│       │   ├── user.service.ts
│       │   ├── job.service.ts
│       │   ├── application.service.ts
│       │   ├── test.service.ts
│       │   ├── review.service.ts
│       │   └── rust.client.ts
│       ├── controllers/
│       │   ├── auth.controller.ts
│       │   ├── user.controller.ts
│       │   ├── job.controller.ts
│       │   ├── application.controller.ts
│       │   ├── test.controller.ts
│       │   └── review.controller.ts
│       └── routes/
│           ├── auth.routes.ts
│           ├── user.routes.ts
│           ├── job.routes.ts
│           ├── application.routes.ts
│           ├── test.routes.ts
│           └── review.routes.ts
└── rust-service/
    ├── Dockerfile
    ├── Cargo.toml
    └── src/
        └── main.rs




# Afrilance – Immutable‑review Freelance Platform

## 🚀 Quick Start

1. Clone the repo and create the folder structure as per instructions.
2. Copy `.env.example` to `backend/.env` and adjust secrets.
3. Run `docker-compose up --build`
4. Backend API available at `http://localhost:3000`
5. Rust service health check: `http://localhost:3001/health`

## 📚 API Documentation

(Add your Postman/OpenAPI docs here.)

## 🛡️ Immutable Reviews

- Every review is hashed (SHA256) and signed (Ed25519) by the Rust microservice.
- Hash + signature stored in DB; reviews cannot be updated or deleted.
- Verification endpoint: `GET /reviews/:id/verify`

## 🧪 Run Tests (after first build)

(Placeholder for integration tests.)






    Set environment variables – copy afrilance/.env.example to afrilance/backend/.env and fill in strong secrets.

    Generate Prisma migration – inside backend/ folder, run:
    bash

    npm install
    npx prisma migrate dev --name init

    This will create the migration files. (If you're using Docker, the entrypoint will run prisma migrate deploy on startup.)

### Build and run from the root:
    bash

    docker-compose up --build

Your platform is now live at http://localhost:3000.
The Rust microservice is at http://localhost:3001.
