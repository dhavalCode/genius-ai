import { NextApiRequest, NextApiResponse } from "next";
import { getUserFromToken } from "@genius-ai/lib/server";
import { defaultHandler, defaultResponder } from "@genius-ai/lib/server";
import prisma from "@genius-ai/prisma";

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getUserFromToken(req, res);

  if (!user) {
    return res.status(401).end();
  }

  if (!req.body?.title || req.body.title === "") {
    res.status(400).json({ message: "Title can not be empty." });
  }

  const created = await prisma.category.create({
    data: {
      name: req.body.title,
      userId: user.id,
    },
  });

  return res.status(201).json(created);
}

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getUserFromToken(req, res);
  if (!user) {
    return res.status(401).end();
  }

  const categories = await prisma.category.findMany();

  return res.status(200).json(categories);
}

export default defaultHandler({
  GET: Promise.resolve({ default: defaultResponder(getHandler) }),
  POST: Promise.resolve({ default: defaultResponder(postHandler) }),
});
