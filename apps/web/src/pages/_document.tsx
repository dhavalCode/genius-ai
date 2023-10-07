import { Html, Head, Main, NextScript } from "next/document";
import { Inter } from 'next/font/google'

import { classNames } from "@genius-ai/lib/utils";

const inter = Inter({ subsets: ['latin'] })

export default function Document() {
  return (
    <Html lang="en" className={classNames("bg-secondary", inter.className)}>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
