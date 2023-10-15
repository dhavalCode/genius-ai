import { NextApiRequest, NextApiResponse } from "next";
import { hashPassword } from "@genius-ai/lib/auth";
import { defaultHandler, defaultResponder } from "@genius-ai/lib/server";
import prisma from "@genius-ai/prisma";

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const { email, password, source } = req.body;
  const cleanEmail = email.toLowerCase();

  if (!cleanEmail || !/.+@.+/.test(cleanEmail)) {
    res.status(400).json({ message: "Invalid email" });
    return;
  }

  if (!password || password.trim().length < 7) {
    return res.status(400).json({
      message: "Password should be at least 7 characters long.",
    });
  }

  // User already exists if email already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      email: cleanEmail,
    },
  });

  if (existingUser) {
    const message: string = "This email is already registered.";
    return res.status(409).json({ message });
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.upsert({
    where: { email: cleanEmail },
    update: {
      password: hashedPassword,
      emailVerified: new Date(Date.now()),
      identityProvider: "EMAIL",
    },
    create: {
      email: cleanEmail,
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
