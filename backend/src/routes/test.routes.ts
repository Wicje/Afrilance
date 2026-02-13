import { Router } from 'express';
import { submitTest } from '../controllers/test.controller';
import { authenticate, requireFreelancer } from '../middlewares/auth';

const router = Router();

router.post('/submit', authenticate, requireFreelancer, submitTest);

export default router;
