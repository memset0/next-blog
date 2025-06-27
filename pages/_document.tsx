import { Html, Head, Main, NextScript } from "next/document";
import clsx from "clsx";

import { fontSans } from "@/config/fonts";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
            /* 隐藏滚动条但保持滚动功能 */
            html {
              scrollbar-width: none; /* Firefox */
              -ms-overflow-style: none; /* IE and Edge */
            }
            
            html::-webkit-scrollbar {
              display: none; /* Chrome, Safari, Opera */
            }
            
            body {
              scrollbar-width: none; /* Firefox */
              -ms-overflow-style: none; /* IE and Edge */
            }
            
            body::-webkit-scrollbar {
              display: none; /* Chrome, Safari, Opera */
            }
          `,
          }}
        />
      </Head>
      <body className={clsx("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
