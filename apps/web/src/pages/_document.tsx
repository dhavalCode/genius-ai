import { Html, Head, Main, NextScript } from "next/document";
import { Inter } from "next/font/google";

import { classNames } from "@genius-ai/lib/utils";

export default function Document() {
  return (
    <Html lang="en" className={classNames("bg-secondary")}>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
