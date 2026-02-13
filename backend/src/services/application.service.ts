import { prisma } from '../config/database';
import { AppStatus } from '@prisma/client';

export const applyToJob = async (freelancerId: string, jobId: string) => {
  // Check if already applied
  const existing = await prisma.application.findFirst({
    where: { freelancerId, jobId },
  });
  if (existing) throw new Error('Already applied to this job');

  return prisma.application.create({
    data: {
      freelancerId,
      jobId,
    },
  });
};

export const updateApplicationStatus = async (
  applicationId: string,
  companyId: string,
  status: AppStatus
) => {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { job: true },
  });
  if (!application) throw new Error('Application not found');
  if (application.job.companyId !== companyId) throw new Error('Not authorized');

  return prisma.application.update({
    where: { id: applicationId },
    data: { status },
  });
};
