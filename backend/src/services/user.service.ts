import { prisma } from '../config/database';

export const getUserProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      type: true,
      publicKey: true,
      createdAt: true,
      // include counts of jobs, reviews, etc.
      _count: {
        select: {
          jobs: true,
          givenReviews: true,
          receivedReviews: true,
          skillTests: true,
        },
      },
    },
  });

  if (!user) throw new Error('User not found');
  return user;
};
