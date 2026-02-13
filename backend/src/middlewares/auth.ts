import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { logger } from '../utils/logger';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const requireCompany = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.type !== 'COMPANY') {
    return res.status(403).json({ error: 'Access denied: company only' });
  }
  next();
};

export const requireFreelancer = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.type !== 'FREELANCER') {
    return res.status(403).json({ error: 'Access denied: freelancer only' });
  }
  next();
};
