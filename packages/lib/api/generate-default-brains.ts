import prisma from "@genius-ai/prisma";
import { CATEGORY_LIST } from "../constants";

export const generateDefaultBrains = async (userId: string): Promise<void> => {
  const found = await prisma.category.findFirst({ where: { userId } });
  
  if (found) {
    return;
  }

  for (const category of CATEGORY_LIST) {
    await prisma.category.create({
      data: {
        name: category.name,
        userId,
        Brains: {
          createMany: {
            data: category.brains.map((brain) => ({ ...brain, userId })),
          },
        },
      },
    });
  }
};
