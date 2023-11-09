import prisma from "@genius-ai/prisma";
import { CATEGORIES_DATA } from "../constants";

export const generateDefaultBrains = async (userId: string): Promise<void> => {
  const found = await prisma.category.findFirst({ where: { userId } });

  if (found) {
    return;
  }

  const categories = CATEGORIES_DATA.map((category) => ({
    ...category,
    userId,
    brains: category.brains.map((brain) => ({ ...brain, userId })),
  }));

  for (const category of categories) {
    await prisma.category.create({
      data: {
        ...category,
        Brains: {
          createMany: {
            data: category.brains,
          },
        },
      },
    });
  }
};
