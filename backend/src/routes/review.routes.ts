import { Router } from 'express';
import { createReview, getUserReviews, verifyReview } from '../controllers/review.controller';
import { authenticate, requireCompany } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { createReviewSchema } from '../validators/reviews';

const router = Router();

router.post('/', authenticate, requireCompany, validate(createReviewSchema), createReview);
router.get('/user/:userId', getUserReviews);
router.get('/:id/verify', verifyReview);

export default router;
