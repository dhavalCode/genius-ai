import { Html, Head, Main, NextScript } from "next/document";
import { Inter } from "next/font/google";

import { classNames } from "@genius-ai/lib/utils";
import { ThemeProvider } from "@/components/ThemeProvider";

import { Toaster } from "@genius-ai/ui";

export default function Document() {
  return (
    <Html lang="en" className={classNames("bg-secondary")}>
      <Head />
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Main />
          <Toaster />
          <NextScript />
        </ThemeProvider>
      </body>
    </Html>
  );
}
