import { Html, Head, Main, NextScript } from "next/document";

import { classNames } from "@genius-ai/lib/utils";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className={classNames("bg-secondary")}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
