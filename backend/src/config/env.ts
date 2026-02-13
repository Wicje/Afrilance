import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  JWT_SECRET: process.env.JWT_SECRET!,
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
  DATABASE_URL: process.env.DATABASE_URL!,
  RUST_SERVICE_URL: process.env.RUST_SERVICE_URL!,
  MASTER_KEY: process.env.MASTER_KEY!,
};

if (!env.JWT_SECRET || !env.DATABASE_URL || !env.RUST_SERVICE_URL) {
  throw new Error('Missing required environment variables');
}
