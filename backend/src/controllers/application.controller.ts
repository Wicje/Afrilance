import { Request, Response, NextFunction } from 'express';
import * as applicationService from '../services/application.service';

export const apply = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const jobId = req.params.jobId;
    const freelancerId = req.user!.id;
    const application = await applicationService.applyToJob(freelancerId, jobId);
    res.status(201).json(application);
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const applicationId = req.params.id;
    const companyId = req.user!.id;
    const { status } = req.body;
    const application = await applicationService.updateApplicationStatus(applicationId, companyId, status);
    res.json(application);
  } catch (error) {
    next(error);
  }
};
