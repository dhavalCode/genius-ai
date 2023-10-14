import { getUserFromToken } from "@genius-ai/lib/server";
import prisma from "@genius-ai/prisma";
import { Category } from "@prisma/client";

export const getCategories = async (
  req: any,
  res: any
): Promise<Category[]> => {
  const user = await getUserFromToken(req, res);
  if (!user) return Promise.reject("Invalid user or token.");
  if (!req || !res) Promise.reject("No res or req");

  const categories = await prisma.category.findMany({
    where: {
      userId: user.id,
    },
  });

  return categories;
};
