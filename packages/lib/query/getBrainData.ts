import { getUserFromToken } from "@genius-ai/lib/server";
import prisma from "@genius-ai/prisma";
import { Brain, Prisma } from "@prisma/client";

export const getBrainData = async (
  brainId: string,
  req: any,
  res: any
): Promise<Brain | null> => {
  const user = await getUserFromToken(req, res);
  if (!user) return Promise.reject("Invalid user or token.");
  if (!req || !res) Promise.reject("No res or req");

  const brainData = await prisma.brain.findFirst({
    where: {
      id: brainId,
    },
  });

  return brainData;
};

export const getBrainDataWithMessages = async (
  brainId: string,
  req: any,
  res: any
): Promise<BrainWithMessagesType | null> => {
  const user = await getUserFromToken(req, res);
  if (!user) return Promise.reject("Invalid user or token.");
  if (!req || !res) Promise.reject("No res or req");

  const brainData = await prisma.brain.findFirst({
    where: {
      id: brainId,
    },
    include: {
      messages: true,
      _count: {
        select: {
          messages: true,
        },
      },
    },
  });

  return brainData;
};

export type BrainWithMessagesType = Prisma.BrainGetPayload<{
  include: {
    messages: true;
    _count: {
      select: {
        messages: true;
      };
    };
  };
}>;
