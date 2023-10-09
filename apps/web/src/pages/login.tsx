import Head from "next/head";
import { getUserFromToken } from "@genius-ai/lib/server";

export default function LoginPage(_props: any) {
  return (
    <>
      <Head>
        <title>Login | Genius ai</title>
      </Head>
      <h1>Login </h1>
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

  return {
    props: {},
  };
}
