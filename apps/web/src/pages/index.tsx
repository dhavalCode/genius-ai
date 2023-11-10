import { useState } from "react";
import { NextPageContext } from "next";
import { getSession } from "next-auth/react";
import { Category } from "@prisma/client";
import {
  BrainCustomType,
  checkSubscription,
  getBrains,
  getCategories,
} from "@genius-ai/lib/query";
import { Label, Switch } from "@genius-ai/ui";

import { Brains } from "@/components/Brains";
import Layout from "@/components/Layout";
import { Categories } from "@/components/Categories";
import { SearchInput } from "@/components/SearchInput";
import { useProModal } from "@genius-ai/lib/hooks";

type HomeProps = {
  categories: Category[];
  brains: BrainCustomType[];
  isPro: boolean;
};

function HomePage({ categories, brains, isPro }: HomeProps) {
  const [isDesignMode, setIsDesignMode] = useState(false);

  const { onOpen: onProModalOpen } = useProModal();

  const handleOnDesignModeChange = (_checked: boolean) => {
    if (!isPro) {
      onProModalOpen();
      return;
    }

    setIsDesignMode(_checked);
  };

  return (
    <Layout isPro={isPro}>
      <div className="h-full p-4 space-y-2">
        <SearchInput />
        <div className="flex items-center space-x-2 py-2">
          <Switch
            id="design-mode"
            checked={isDesignMode}
            onCheckedChange={handleOnDesignModeChange}
          />
          <Label className="text-muted-foreground" htmlFor="design-mode">
            Customize
          </Label>
        </div>
        <Categories data={categories} isDesignMode={isDesignMode} />
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

  const isPro = await checkSubscription(context.req, context.res);

  return {
    props: { categories, brains: JSON.parse(JSON.stringify(brains)), isPro },
  };
}

export default HomePage;
