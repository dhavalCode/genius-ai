import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@genius-ai/prisma";
import { hashPassword } from "@genius-ai/lib/auth";
import { defaultHandler, defaultResponder } from "@genius-ai/lib/server";
import { SignupInputType, signupSchema } from "@genius-ai/lib/validations";

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const validated = signupSchema.safeParse(req.body);

  if (!validated.success)
    return res.status(400).json({
      message: "Please provide valid inputs.",
      error: validated.error,
    });

  const data: SignupInputType = validated.data;

  // User already exists if email already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    const message: string = "This email is already registered.";
    return res.status(409).json({ message });
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await prisma.user.upsert({
    where: { email: data.email },
    update: {
      name: data.name,
      password: hashedPassword,
      emailVerified: new Date(Date.now()),
      identityProvider: "EMAIL",
    },
    create: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      identityProvider: "EMAIL",
      emailVerified: new Date(Date.now()),
    },
  });

  // create one default category

  const found = await prisma.category.findFirst({
    where: {
      userId: user.id,
    },
  });

  if (!found) {
    await prisma.category.create({
      data: {
        name: "General",
        userId: user.id,
      },
    });
  }

  res.status(201).end();
}

export default defaultHandler({
  POST: Promise.resolve({ default: defaultResponder(postHandler) }),
});
