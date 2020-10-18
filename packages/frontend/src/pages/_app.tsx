import React from "react";
import { createEnvironment } from "../lib/createEnvironment";

export default function App({ Component, pageProps }: any): any {
  const environment = createEnvironment(pageProps.records);
  return <Component {...pageProps} environment={environment} />;
}
