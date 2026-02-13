import { Router } from 'express';
import { getProfile } from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/profile', authenticate, getProfile);
router.get('/:id', getProfile); // public profile

export default router;
