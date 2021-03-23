import Search from "@/components/Search";
import "@/styles/globals.scss";
import { ApolloProvider } from "@apollo/client";
import { ConfigProvider } from "@hashtag-design-system/components";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { AnimateSharedLayout } from "framer-motion";
import { AppProps } from "next/app";
import { INITIAL_APOLLO_STATE, useApollo } from "../lib/apollo";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

function App({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(undefined, pageProps[INITIAL_APOLLO_STATE]);

  return (
    <ApolloProvider client={apolloClient}>
      <Elements stripe={stripePromise}>
        <ConfigProvider variables={{ ipAddr: undefined }}>
          <Search.Context>
            <AnimateSharedLayout>
              <Component {...pageProps} />
            </AnimateSharedLayout>
          </Search.Context>
        </ConfigProvider>
      </Elements>
    </ApolloProvider>
  );
}

export default App;
