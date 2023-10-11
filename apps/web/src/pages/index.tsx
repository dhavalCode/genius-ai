import { NextPageContext } from "next";
import { getSession } from "next-auth/react";
import { Category } from "@prisma/client";

import prisma from "@genius-ai/prisma";

import Layout from "@/components/Layout";
import { Categories } from "@/components/Categories";
import { SearchInput } from "@/components/SearchInput";
import { Brains } from "../components/Brains";

type HomeProps = {
  categories: Category[];
};

function HomePage({ categories }: HomeProps) {
  return (
    <Layout>
      <div className="h-full p-4 space-y-2">
        <SearchInput />
        <Categories data={categories} />
        <Brains data={[]} />
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (!session?.user?.email) {
    return { redirect: { permanent: false, destination: "/login" } };
  }

  /* const data = await prisma.brain.findMany({
    where: {
      categoryId: searchParams.categoryId,
      name: {
        search: searchParams.name,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          messages: true,
        },
      },
    },
  }); */

  const categories = await prisma.category.findMany();

  return { props: { categories } };
}

export default HomePage;
