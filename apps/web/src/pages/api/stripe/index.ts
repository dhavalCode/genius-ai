import { NextApiRequest, NextApiResponse } from "next";
import { getUserFromToken } from "@genius-ai/lib/server";
import prisma from "@genius-ai/prisma";
import { defaultHandler, defaultResponder } from "@genius-ai/lib/server";
import { stripe } from "@genius-ai/lib/api";
import { absoluteUrl } from "@genius-ai/lib/utils";

const settingsUrl = absoluteUrl("/settings");

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getUserFromToken(req, res);
  if (!user) {
    return res.status(401).end();
  }

  const userSubscription = await prisma.userSubscription.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (userSubscription && userSubscription.stripeCustomerId) {
    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: userSubscription.stripeCustomerId,
      return_url: settingsUrl,
    });

    return res.status(200).send(JSON.stringify({ url: stripeSession.url }));
  }

  const stripeSession = await stripe.checkout.sessions.create({
    success_url: settingsUrl,
    cancel_url: settingsUrl,
    payment_method_types: ["card"],
    mode: "subscription",
    billing_address_collection: "auto",
    customer_email: user.email,
    line_items: [
      {
        price_data: {
          currency: "USD",
          product_data: {
            name: "Brain Pro",
            description: "Create Custom AI Brains",
          },
          unit_amount: 1000,
          recurring: {
            interval: "month",
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId: user.id,
    },
  });

  return res.status(200).send(JSON.stringify({ url: stripeSession.url }));
}

export default defaultHandler({
  GET: Promise.resolve({ default: defaultResponder(getHandler) }),
});
