import { Request, Response, NextFunction } from 'express';
import * as testService from '../services/test.service';

export const submitTest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { testName, score } = req.body;
    const userId = req.user!.id;
    const test = await testService.submitTest(userId, testName, score);
    res.status(201).json(test);
  } catch (error) {
    next(error);
  }
};
