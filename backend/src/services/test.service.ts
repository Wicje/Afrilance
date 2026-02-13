import { prisma } from '../config/database';
import { generateHash } from './rust.client';

export const submitTest = async (
  userId: string,
  testName: string,
  score: number
) => {
  // Generate hash using rust service
  const timestamp = Date.now();
  const content = `${userId}${testName}${score}${timestamp}`;
  const hash = await generateHash({
    content,
    reviewer_id: userId, // reuse same endpoint, just need unique content
    timestamp,
  });

  const test = await prisma.skillTest.create({
    data: {
      userId,
      testName,
      score,
      hash,
    },
  });

  return test;
};
