import { NextPageContext } from "next";
import { getSession } from "next-auth/react";
import SubscriptionButton from "@/components/SubscriptionButton";
import Layout from "@/components/Layout";
import { checkSubscription } from "@genius-ai/lib/query";

const SettingsPage = ({ isPro }: { isPro: boolean }) => {
  return (
    <Layout isPro={isPro}>
      <div className="h-full p-4 space-y-2">
        <h3 className="text-lg font-medium">Settings</h3>
        <div className="text-muted-foreground text-sm">
          {isPro
            ? "You are currently on a Pro plan."
            : "You are currently on a free plan."}
        </div>
        <SubscriptionButton isPro={isPro} />
      </div>
    </Layout>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (!session?.user?.email) {
    return { redirect: { permanent: false, destination: "/login" } };
  }

  const isPro = await checkSubscription(context.req, context.res);

  return {
    props: { isPro },
  };
}

export default SettingsPage;
