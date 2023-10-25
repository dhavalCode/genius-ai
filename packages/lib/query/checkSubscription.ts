import { getUserFromToken } from "@genius-ai/lib/server";
import prisma from "@genius-ai/prisma";

const DAY_IN_MS = 86_400_000;

export const checkSubscription = async (
  req: any,
  res: any
): Promise<Boolean> => {
  const user = await getUserFromToken(req, res);
  if (!user) return Promise.reject("Invalid user or token.");
  if (!req || !res) Promise.reject("No res or req");

  const userSubscription = await prisma.userSubscription.findUnique({
    where: {
      userId: user.id,
    },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
    },
  });

  if (!userSubscription) {
    return false;
  }

  const isValid =
    userSubscription.stripePriceId &&
    userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS >
      Date.now();

  return !!isValid;
};
