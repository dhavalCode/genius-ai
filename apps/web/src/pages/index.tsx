import type { ReactElement } from 'react'
import { NextPageContext } from "next";
import { getSession } from "next-auth/react";

import Layout from '@/components/Layout';

function HomePage() {
  return <></>;
}

HomePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (!session?.user?.email) {
    return { redirect: { permanent: false, destination: "/login" } };
  }

  return null;
}

export default HomePage;
