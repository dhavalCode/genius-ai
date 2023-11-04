import { NextApiRequest, NextApiResponse } from "next";
import { getUserFromToken } from "@genius-ai/lib/server";
import { defaultHandler, defaultResponder } from "@genius-ai/lib/server";
import prisma from "@genius-ai/prisma";

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getUserFromToken(req, res);
  if (!user) {
    return res.status(401).end();
  }

  const title = req.query["title"] as string | undefined;

  if (!title || title === "") {
    return res.status(400).json({
      message: "Please provide name",
    });
  }

  const category = await prisma.category.findFirst({
    where: {
      name: title,
      userId: user.id,
    },
  });

  return res.status(200).json({ exist: !!category });
}

export default defaultHandler({
  GET: Promise.resolve({ default: defaultResponder(getHandler) }),
});
