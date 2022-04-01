import { ApolloClient, ApolloLink } from "@apollo/client";
import { GetServerSidePropsContext } from "next";
import { cache } from "./cache";
import { httpLink, ipMiddleware } from "./links";

export const createApolloClient = (ctx?: GetServerSidePropsContext) => {
  // const authHeaders = ctx && ctx.req && getAuthContext({ req: ctx.req }).headers;
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: ApolloLink.from([ipMiddleware, httpLink]),
    cache,
    // connectToDevTools: process.env.NODE_ENV !== "production",
    connectToDevTools: true,
    credentials: "include",
    defaultOptions: {
      mutate: {
        errorPolicy: "all",
      },
      query: {
        errorPolicy: "all",
      },
    },
    // resolvers: {
    //   BeachBar: {
    //     formattedLocation: ({ location }) => {
    //       if (!location) return null;

    //       let formattedLocation: string[] = [];
    //       if (location.region) formattedLocation = [...formattedLocation, location.region.name];
    //       if (location.city) formattedLocation = [...formattedLocation, location.city.name];
    //       if (location.country) {
    //         formattedLocation = [...formattedLocation, location.country.alpha2Code || location.country.name];
    //       }
    //       return formattedLocation.join(", ");
    //     },
    //   },
    // },
  });
};
