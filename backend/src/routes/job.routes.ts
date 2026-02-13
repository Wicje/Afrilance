import { Router } from 'express';
import {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
} from '../controllers/job.controller';
import { authenticate, requireCompany } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { createJobSchema, updateJobSchema } from '../validators/jobs';

const router = Router();

router.get('/', getJobs);
router.get('/:id', getJob);
router.post('/', authenticate, requireCompany, validate(createJobSchema), createJob);
router.patch('/:id', authenticate, requireCompany, validate(updateJobSchema), updateJob);
router.delete('/:id', authenticate, requireCompany, deleteJob);

export default router;
