import Stripe from "stripe";
import { buffer } from "micro";
import { NextApiRequest, NextApiResponse } from "next";
import { defaultHandler, defaultResponder } from "@genius-ai/lib/server";
import { stripe } from "@genius-ai/lib/api";
import prisma from "@genius-ai/prisma";

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  
  const sig =
    typeof req.headers["stripe-signature"] === "string"
      ? req.headers["stripe-signature"]
      : "";

  if (!sig) {
    return res.status(400).json({
      success: false,
      message: "No signature found in request",
    });
  }

  const body = await buffer(req);

  const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    if (!session?.metadata?.userId) {
      res.status(400).end("User id is required");
    }

    await prisma.userSubscription.create({
      data: {
        userId: session?.metadata?.userId || "",
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    });
  }

  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    await prisma.userSubscription.update({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    });
  }

  return res.status(200).end();
}

export default defaultHandler({
  POST: Promise.resolve({ default: defaultResponder(postHandler) }),
});
