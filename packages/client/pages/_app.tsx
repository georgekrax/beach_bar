import "@/styles/globals.scss";
import { ConfigProvider } from "@hashtag-design-system/components";
import { AnimateSharedLayout } from "framer-motion";
import { NextComponentType, NextPageContext } from "next";
import { AppProps } from "next/app";
import dynamic from "next/dynamic";

const Layout = dynamic(() => import("../components/Layout"));

export default function App({
  Component,
  pageProps,
}: AppProps & { Component: NextComponentType<NextPageContext, any> & { hasLayout: boolean } }): JSX.Element {
  return (
    <ConfigProvider>
      <AnimateSharedLayout>
        <Component {...pageProps} />
      </AnimateSharedLayout>
    </ConfigProvider>
  );
}
