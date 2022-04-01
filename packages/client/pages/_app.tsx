import { Context as AuthContext } from "@/components/Auth/Context";
import { Context as SearchContext } from "@/components/Search/Context";
import { INITIAL_APOLLO_STATE, useApollo } from "@/lib/apollo";
import "@/styles/globals.scss";
import { ApolloProvider } from "@apollo/client";
import { ChakraProvider as HashtagProvider } from "@hashtag-design-system/components";
import "@hashtag-design-system/components/build/index.css";
import "@hashtag-design-system/primitives/src/globals.scss";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import "mapbox-gl/dist/mapbox-gl.css";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import Head from "next/head";
import "tippy.js/animations/shift-away.css";
import "tippy.js/dist/tippy.css";
import theme from "../theme";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const apolloClient = useApollo(undefined, pageProps[INITIAL_APOLLO_STATE]);

  return (
    <ApolloProvider client={apolloClient}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <HashtagProvider theme={theme}>
        {/* <ConfigProvider
          variables={{ primary: configDefaultColors.volcano["500"], ipAddr: undefined, mapDialogWidth: 700 }}
        > */}
        <SessionProvider session={session}>
          <AuthContext>
            <SearchContext>
              <Elements stripe={stripePromise}>
                <Component {...pageProps} />
              </Elements>
            </SearchContext>
          </AuthContext>
        </SessionProvider>
        {/* </ConfigProvider> */}
      </HashtagProvider>
    </ApolloProvider>
  );
}

export default App;
