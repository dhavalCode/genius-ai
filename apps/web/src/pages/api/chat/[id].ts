import { StreamingTextResponse, LangChainStream } from "ai";
import { Replicate } from "langchain/llms/replicate";
import { CallbackManager } from "langchain/callbacks";
import { NextApiRequest, NextApiResponse } from "next";

import { getUserFromToken } from "@genius-ai/lib/server";
import { defaultHandler, defaultResponder } from "@genius-ai/lib/server";
import { chatSchema } from "@genius-ai/lib/validations";
import { MemoryManager, rateLimit } from "@genius-ai/lib/api";
import prisma from "@genius-ai/prisma";

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getUserFromToken(req, res);

  if (!user) {
    return res.status(401).end();
  }

  let reqBody = {};

  try {
    reqBody = JSON.parse(req.body);
  } catch (error) {
    return res.status(400).json({
      message: "Please provide valid inputs.",
    });
  }

  const validated = chatSchema.safeParse(reqBody);

  if (!validated.success)
    return res.status(400).json({
      message: "Please provide valid inputs.",
      error: validated.error,
    });

  const id = req.query.id as string;

  try {
    const { prompt } = validated.data;

    const identifier = req.url + "-" + user.id;
    const { success } = await rateLimit(identifier);

    if (!success) {
      return res.status(429).end("Rate limit exceeded");
    }

    const brain = await prisma.brain.update({
      where: {
        id: id,
      },
      data: {
        messages: {
          create: {
            content: prompt,
            role: "user",
            userId: user.id,
          },
        },
      },
    });

    if (!brain) {
      return res.status(404).end("Brain not found");
    }

    const name = brain.id;
    const brain_file_name = name + ".txt";

    const brainKey = {
      brainName: name!,
      userId: user.id,
      modelName: "llama2-13b",
    };
    const memoryManager = await MemoryManager.getInstance();

    const records = await memoryManager.readLatestHistory(brainKey);
    if (records.length === 0) {
      await memoryManager.seedChatHistory(brain.seed, "\n\n", brainKey);
    }
    await memoryManager.writeToHistory("User: " + prompt + "\n", brainKey);

    const recentChatHistory = await memoryManager.readLatestHistory(brainKey);

    const similarDocs = await memoryManager.vectorSearch(
      recentChatHistory,
      brain_file_name
    );

    let relevantHistory = "";
    if (!!similarDocs && similarDocs.length !== 0) {
      relevantHistory = similarDocs.map((doc) => doc.pageContent).join("\n");
    }
    const { handlers } = LangChainStream();
    // Call Replicate for inference
    const model = new Replicate({
      model:
        "a16z-infra/llama-2-13b-chat:df7690f1994d94e96ad9d568eac121aecf50684a0b0963b25a41cc40061269e5",
      input: {
        max_length: 2048,
      },
      apiKey: process.env.REPLICATE_API_TOKEN,
      callbackManager: CallbackManager.fromHandlers(handlers),
    });

    // Turn verbose on for debugging
    model.verbose = true;

    const resp = String(
      await model
        .call(
          `
        ONLY generate plain sentences without prefix of who is speaking. DO NOT use ${brain.name}: prefix. 

        ${brain.instructions}

        Below are relevant details about ${brain.name}'s past and the conversation you are in.
        ${relevantHistory}


        ${recentChatHistory}\n${brain.name}:`
        )
        .catch(console.error)
    );

    const cleaned = resp.replaceAll(",", "");
    const chunks = cleaned.split("\n");
    const response = chunks[0];

    await memoryManager.writeToHistory("" + response.trim(), brainKey);
    var Readable = require("stream").Readable;

    let s = new Readable();
    s.push(response);
    s.push(null);
    if (response !== undefined && response.length > 1) {
      memoryManager.writeToHistory("" + response.trim(), brainKey);

      await prisma.brain.update({
        where: {
          id: id,
        },
        data: {
          messages: {
            create: {
              content: response.trim(),
              role: "system",
              userId: user.id,
            },
          },
        },
      });
    }

    return new StreamingTextResponse(s);
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong. Internal Server Error. ",
      error: error,
    });
  }
}

export default defaultHandler({
  POST: Promise.resolve({ default: defaultResponder(postHandler) }),
});
