import { NextApiRequest, NextApiResponse } from "next";
import { getUserFromToken } from "@genius-ai/lib/server";
import {
  BrainCreationType,
  brainCreationSchema,
} from "@genius-ai/lib/validations";
import { defaultHandler, defaultResponder } from "@genius-ai/lib/server";
import prisma from "@genius-ai/prisma";

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getUserFromToken(req, res);

  if (!user) {
    return res.status(401).end();
  }

  const validated = brainCreationSchema.safeParse(req.body);

  if (!validated.success)
    return res.status(400).json({
      message: "Please provide valid inputs.",
      error: validated.error,
    });

  const data: BrainCreationType = validated.data;

  const created = await prisma.brain.create({
    data: {
      ...data,
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

  const brains = await prisma.brain.findMany();

  return res.status(200).json(brains);
}

export default defaultHandler({
  GET: Promise.resolve({ default: defaultResponder(getHandler) }),
  POST: Promise.resolve({ default: defaultResponder(postHandler) }),
});
