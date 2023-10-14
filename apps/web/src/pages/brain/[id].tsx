import { Brain, Category } from "@prisma/client";
import { getUserFromToken } from "@genius-ai/lib/server";
import { getBrainData, getCategories } from "@genius-ai/lib/query";

import { BrainCreationForm } from "@/components/BrainCreationForm";
import Layout from "@/components/Layout";

type BrainIdPageProps = {
  categories: Category[];
  initialData: Brain | null;
};

const BrainIdPage = (props: BrainIdPageProps) => {
  const { categories, initialData } = props;

  return (
    <Layout>
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

  return { props: { categories, initialData } };
}

export default BrainIdPage;
