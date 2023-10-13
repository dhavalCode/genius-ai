import { NextApiRequest, NextApiResponse } from "next";
import { getUserFromToken } from "@genius-ai/lib/server";
import { defaultHandler, defaultResponder } from "@genius-ai/lib/server";
import prisma from "@genius-ai/prisma";

async function getByIdHandler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getUserFromToken(req, res);

  if (!user) {
    return res.status(401).end();
  }

  const id = req.query.id as string;

  const category = await prisma.category.findFirst({ where: { id } });

  if (!category) res.status(404).end(`No Category with id ${id} found.`);

  return res.status(200).json(category);
}

async function patchHandler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getUserFromToken(req, res);

  if (!user) {
    return res.status(401).end();
  }

  const id = req.query.id as string;

  const category = await prisma.category.update({
    where: { id },
    data: req.body,
  });

  return res.status(200).json(category);
}

async function deleteHandler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getUserFromToken(req, res);

  if (!user) {
    return res.status(401).end();
  }

  const id = req.query.id as string;

  const category = await prisma.category.delete({
    where: { id },
  });

  return res.status(200).json(category);
}

export default defaultHandler({
  GET: Promise.resolve({ default: defaultResponder(getByIdHandler) }),
  PATCH: Promise.resolve({ default: defaultResponder(patchHandler) }),
  DELETE: Promise.resolve({ default: defaultResponder(deleteHandler) }),
});
