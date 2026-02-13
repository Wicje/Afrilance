import { z } from 'zod';

export const createJobSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200),
    description: z.string().min(1),
    budget: z.number().positive().optional(),
  }),
});

export const updateJobSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().min(1).optional(),
    budget: z.number().positive().optional(),
    status: z.enum(['OPEN', 'IN_PROGRESS', 'CLOSED']).optional(),
  }),
  params: z.object({
    id: z.string().cuid(),
  }),
});
