import { NextPageContext } from "next";
import { getSession } from "next-auth/react";
import { Brain, Category } from "@prisma/client";
import { getBrains, getCategories } from "@genius-ai/lib/query";

import { Brains } from "@/components/Brains";
import Layout from "@/components/Layout";
import { Categories } from "@/components/Categories";
import { SearchInput } from "@/components/SearchInput";

type HomeProps = {
  categories: Category[];
  brains: Brain[];
};

function HomePage({ categories, brains }: HomeProps) {
  return (
    <Layout>
      <div className="h-full p-4 space-y-2">
        <SearchInput />
        <Categories data={categories} />
        <Brains data={brains} />
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (!session?.user?.email) {
    return { redirect: { permanent: false, destination: "/login" } };
  }

  const categories = await getCategories(context.req, context.res);

  const brains = await getBrains(context.req, context.res);

  return { props: { categories, brains: JSON.parse(JSON.stringify(brains)) } };
}

export default HomePage;
