import Head from "next/head";
import { getUserFromToken } from "@genius-ai/lib/server";
import Login from "../components/Login";

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Login | Genius ai</title>
      </Head>
      <Login />
    </>
  );
}

export async function getServerSideProps(context: any) {
  const user = await getUserFromToken(context.req, context.res);
  if (user)
    return {
      redirect: {
        source: "/login",
        destination: "/",
        permanent: false,
      },
    };

  return { props: {} };
}
