import { z } from 'zod';

export const createReviewSchema = z.object({
  body: z.object({
    revieweeId: z.string().cuid(),
    content: z.string().min(1).max(2000),
  }),
});
