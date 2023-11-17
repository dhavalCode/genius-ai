import { Brain, Category } from "@prisma/client";
import { getUserFromToken } from "@genius-ai/lib/server";
import {
  checkSubscription,
  getBrainData,
  getCategories,
} from "@genius-ai/lib/query";

import { BrainCreationForm } from "@/components/BrainCreationForm";
import Layout from "@/components/Layout";

type BrainIdPageProps = {
  categories: Category[];
  initialData: Brain | null;
  isPro: boolean;
};

const BrainIdPage = (props: BrainIdPageProps) => {
  const { categories, initialData, isPro } = props;

  return (
    <Layout isPro={isPro}>
      <BrainCreationForm initialData={initialData} categories={categories} />
    </Layout>
  );
};

export async function getServerSideProps(context: any) {
  const user = await getUserFromToken(context.req, context.res);
  if (!user)
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };

  let categories: Category[] = [];
  let initialData: Brain | null = null;

  let brainId = "";

  if (context.query["id"]) {
    brainId = context.query["id"] as string;
  }

  try {
    categories = await getCategories(context.req, context.res);
    initialData = await getBrainData(brainId, context.req, context.res);
  } catch (error) {
    categories = [];
    initialData = null;
  }

  const isPro = await checkSubscription(context.req, context.res);

  return {
    props: {
      categories: JSON.parse(JSON.stringify(categories)),
      initialData: JSON.parse(JSON.stringify(initialData)),
      isPro,
    },
  };
}

export default BrainIdPage;
