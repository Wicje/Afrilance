import { Request, Response, NextFunction } from 'express';
import * as reviewService from '../services/review.service';

export const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reviewerId = req.user!.id;
    const { revieweeId, content } = req.body;
    const review = await reviewService.createReview(reviewerId, revieweeId, content);
    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

export const getUserReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId;
    const reviews = await reviewService.getReviewsForUser(userId);
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

export const verifyReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reviewId = req.params.id;
    const result = await reviewService.verifyReview(reviewId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
