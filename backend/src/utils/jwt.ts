import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export const generateToken = (userId: string, email: string, type: string): string => {
  return jwt.sign({ id: userId, email, type }, env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, env.JWT_SECRET);
};
