import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id || req.user!.id;
    const profile = await userService.getUserProfile(userId);
    res.json(profile);
  } catch (error) {
    next(error);
  }
};
