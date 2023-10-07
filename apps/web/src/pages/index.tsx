import { NextPageContext } from "next";
import { getSession } from "next-auth/react";

function HomePage() {
  return;
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (!session?.user?.email) {
    return { redirect: { permanent: false, destination: "/login" } };
  }

  return null;
}

export default HomePage;
