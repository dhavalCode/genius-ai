import { getUserFromToken } from "@genius-ai/lib/server";
import prisma from "@genius-ai/prisma";
import { Brain, Prisma } from "@prisma/client";

export const getBrains = async (req: any, res: any): Promise<Brain[]> => {
  const user = await getUserFromToken(req, res);
  if (!user) return Promise.reject("Invalid user or token.");
  if (!req || !res) Promise.reject("No res or req");

  const brains = await prisma.brain.findMany({
    where: {
      userId: user.id,
    },
    include: {
      _count: {
        select: {
          messages: true,
        },
      },
    },
  });

  return brains;
};

export type BrainCustomType = Prisma.BrainGetPayload<{
  include: {
    _count: {
      select: {
        messages: true;
      };
    };
  };
}>;
