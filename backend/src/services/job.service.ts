import { prisma } from '../config/database';
import { JobStatus } from '@prisma/client';

export const createJob = async (
  companyId: string,
  title: string,
  description: string,
  budget?: number
) => {
  return prisma.job.create({
    data: {
      title,
      description,
      budget,
      companyId,
    },
  });
};

export const getJobs = async (filters?: { status?: JobStatus; companyId?: string }) => {
  return prisma.job.findMany({
    where: filters,
    include: {
      company: {
        select: { id: true, name: true },
      },
      _count: {
        select: { applications: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getJobById = async (jobId: string) => {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      company: {
        select: { id: true, name: true },
      },
      applications: {
        include: {
          freelancer: {
            select: { id: true, name: true },
          },
        },
      },
    },
  });
  if (!job) throw new Error('Job not found');
  return job;
};

export const updateJob = async (jobId: string, companyId: string, data: any) => {
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) throw new Error('Job not found');
  if (job.companyId !== companyId) throw new Error('Not authorized');

  return prisma.job.update({
    where: { id: jobId },
    data,
  });
};

export const deleteJob = async (jobId: string, companyId: string) => {
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) throw new Error('Job not found');
  if (job.companyId !== companyId) throw new Error('Not authorized');

  await prisma.job.delete({ where: { id: jobId } });
};
