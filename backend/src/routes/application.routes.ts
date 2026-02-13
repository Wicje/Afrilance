import { Router } from 'express';
import { apply, updateStatus } from '../controllers/application.controller';
import { authenticate, requireFreelancer, requireCompany } from '../middlewares/auth';

const router = Router();

router.post('/jobs/:jobId/apply', authenticate, requireFreelancer, apply);
router.patch('/:id', authenticate, requireCompany, updateStatus);

export default router;
