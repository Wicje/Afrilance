import { Request, Response, NextFunction } from 'express';
import * as jobService from '../services/job.service';

export const createJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, budget } = req.body;
    const companyId = req.user!.id;
    const job = await jobService.createJob(companyId, title, description, budget);
    res.status(201).json(job);
  } catch (error) {
    next(error);
  }
};

export const getJobs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, companyId } = req.query;
    const filters: any = {};
    if (status) filters.status = status as string;
    if (companyId) filters.companyId = companyId as string;
    const jobs = await jobService.getJobs(filters);
    res.json(jobs);
  } catch (error) {
    next(error);
  }
};

export const getJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const job = await jobService.getJobById(req.params.id);
    res.json(job);
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const jobId = req.params.id;
    const companyId = req.user!.id;
    const job = await jobService.updateJob(jobId, companyId, req.body);
    res.json(job);
  } catch (error) {
    next(error);
  }
};

export const deleteJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const jobId = req.params.id;
    const companyId = req.user!.id;
    await jobService.deleteJob(jobId, companyId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
