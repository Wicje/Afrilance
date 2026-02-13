import { prisma } from '../config/database';
import { generateHash, signHash, verifySignature } from './rust.client';
import { logger } from '../utils/logger';
import crypto from 'crypto';

export const createReview = async (
  reviewerId: string,
  revieweeId: string,
  content: string
) => {
  // 1. Get reviewer's private key (stored securely? For MVP we fetch from env or we generate per request)
  // In production, private key must be retrieved from a secure vault.
  // For this MVP, we assume company's private key is stored in environment or retrieved via some secure method.
  // We'll simulate: we fetch the company's publicKey from DB, but privateKey is not stored.
  // Instead, we will generate a keypair on registration and return the private key once.
  // For review creation, the client must provide the private key in the request? That's insecure.
  // Better: backend stores encrypted private keys and decrypts with a master key.
  // For simplicity in this MVP, we will have a hardcoded private key for each company? No.
  // We will instead have the Rust service hold a master key and derive per-company keys? Not feasible.
  // Real solution: Store private keys encrypted with a master key in the DB.
  // Let's implement that: we add an `encryptedPrivateKey` field to User model.
  // We'll modify schema and service accordingly.
  // For now, we'll assume the company's private key is stored encrypted and we decrypt it here.
  // We need to adjust the schema and key generation.

  // TEMPORARY: We'll fetch the reviewer's public key, but we don't have private key.
  // This is a blocker. Let's do it properly:

  // 1. Get reviewer's encrypted private key
  const reviewer = await prisma.user.findUnique({
    where: { id: reviewerId },
    select: { privateKeyEncrypted: true, publicKey: true },
  });
  if (!reviewer || !reviewer.privateKeyEncrypted) {
    throw new Error('Reviewer private key not available');
  }

  // Decrypt private key (using a master secret)
  const masterKey = process.env.MASTER_KEY!; // Should be in env
  const privateKey = decrypt(reviewer.privateKeyEncrypted, masterKey); // we'll write decrypt util

  // 2. Generate hash of review content + reviewer + reviewee + timestamp
  const timestamp = Date.now();
  const contentForHash = `${content}${reviewerId}${revieweeId}${timestamp}`;
  const hash = await generateHash({
    content: contentForHash,
    reviewer_id: reviewerId,
    timestamp,
  });

  // 3. Sign the hash
  const signature = await signHash({
    hash,
    private_key: privateKey,
  });

  // 4. Store review with hash and signature
  const review = await prisma.review.create({
    data: {
      content,
      reviewerId,
      revieweeId,
      hash,
      signature,
      createdAt: new Date(timestamp),
    },
  });

  logger.info(`Review created: ${review.id}`);
  return review;
};

export const getReviewsForUser = async (userId: string) => {
  return prisma.review.findMany({
    where: { revieweeId: userId },
    include: {
      reviewer: {
        select: { id: true, name: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const verifyReview = async (reviewId: string) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    include: { reviewer: { select: { publicKey: true } } },
  });
  if (!review) throw new Error('Review not found');

  const publicKey = review.reviewer.publicKey;
  if (!publicKey) throw new Error('Reviewer public key missing');

  const valid = await verifySignature({
    hash: review.hash,
    signature: review.signature,
    public_key: publicKey,
  });

  return { valid, review };
};

// Simple AES-256-GCM decryption (for demonstration)

function decrypt(encryptedHex: string, key: string): string {
  const parts = encryptedHex.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const tag = Buffer.from(parts[1], 'hex');
  const ciphertext = Buffer.from(parts[2], 'hex');
  const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(key, 'hex'), iv);
  decipher.setAuthTag(tag);
  let decrypted = decipher.update(ciphertext, undefined, 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
