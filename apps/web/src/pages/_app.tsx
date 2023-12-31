import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@genius-ai/ui";

import { ThemeProvider } from "@/components/ThemeProvider";
import { ProModal } from "@/components/ProModal";
import { CategoryModal } from "../components/CategoryModal";

import "@/styles/globals.css";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <ProModal />
        <CategoryModal />
        <Toaster />
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionProvider>
  );
}
