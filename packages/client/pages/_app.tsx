import "@/styles/globals.scss";
import "mapbox-gl/dist/mapbox-gl.css";
<<<<<<< HEAD
// import "antd/dist/antd.css";
=======
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
import { Context as AuthContext } from "@/components/Auth/Context";
import { Context as SearchContext } from "@/components/Search/Context";
import { INITIAL_APOLLO_STATE, useApollo } from "@/lib/apollo";
import { ApolloProvider } from "@apollo/client";
import { ConfigProvider } from "@hashtag-design-system/components";
// import { Elements } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
import { AnimateSharedLayout } from "framer-motion";
import { AppProps } from "next/app";
import Head from "next/head";

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

function App({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(undefined, pageProps[INITIAL_APOLLO_STATE]);

  return (
    <ApolloProvider client={apolloClient}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      {/* <Elements stripe={stripePromise}> */}
        <ConfigProvider variables={{ ipAddr: undefined }}>
          <AuthContext>
            <SearchContext>
              <AnimateSharedLayout>
                <Component {...pageProps} />
              </AnimateSharedLayout>
            </SearchContext>
          </AuthContext>
        </ConfigProvider>
      {/* </Elements> */}
    </ApolloProvider>
  );
}

export default App;
