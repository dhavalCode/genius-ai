import { Html, Head, Main, NextScript } from "next/document";
import { Inter } from "next/font/google";

import { classNames } from "@genius-ai/lib/utils";
import { ThemeProvider } from "@/components/ThemeProvider";

// const inter = Inter({ subsets: ['latin'] })

export default function Document() {
  return (
    <Html lang="en" className={classNames("bg-secondary")}>
      <Head />
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Main />
          <NextScript />
        </ThemeProvider>
      </body>
    </Html>
  );
}
