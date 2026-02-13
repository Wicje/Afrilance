import { prisma } from '../config/database';
import { hashPassword, comparePassword } from '../utils/bcrypt';
import { generateToken } from '../utils/jwt';
import { generateEd25519KeyPair } from '../utils/keygen';
import { logger } from '../utils/logger';
import { UserType } from '@prisma/client';
import { env } from '../config/env';

export const registerUser = async (
  email: string,
  password: string,
  name: string,
  type: UserType
) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error('Email already registered');
  }

  const hashedPassword = await hashPassword(password);

  // If company, generate Ed25519 key pair
  let publicKey: string | undefined;
  let privateKey: string | undefined;
  if (type === 'COMPANY') {
    const keys = generateEd25519KeyPair();
    publicKey = keys.publicKey;
    privateKey = keys.privateKey; // Will be returned once to the user
  }

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      type,
      publicKey: keys.publicKey,
      privateKeyEncrypted: keys.privateKeyEncrypted,
    },
  });

  const token = generateToken(user.id, user.email, user.type);

  logger.info(`User registered: ${user.id}`);

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      type: user.type,
      publicKey: user.publicKey,
    },
    token,
    // Return private key only once for company
    privateKey: keys.privateKeyPlain  
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const valid = await comparePassword(password, user.password);
  if (!valid) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user.id, user.email, user.type);
  logger.info(`User logged in: ${user.id}`);

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      type: user.type,
    },
    token,
  };
};
