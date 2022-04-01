import { IpAddrType } from "@/typings/graphql";
import { InMemoryCache, makeVar } from "@apollo/client";
import { TypedTypePolicies } from "./apollo-helpers";

export const cache = new InMemoryCache({
  typePolicies: {
    User: {
      merge(existing) {
        return existing;
      },
    },
    BeachBarLocation: {
      merge(existing, incoming) {
        return { ...existing, ...incoming };
      },
    },
    BeachBarReview: {
      fields: {
        votes: {
          merge(_, incoming) {
            return incoming;
          },
        },
      },
    },
    Cart: {
      fields: {
        products: {
          merge(_, incoming) {
            return incoming;
          },
        },
        foods: {
          merge(_, incoming) {
            return incoming;
          },
        },
      },
    },
    BeachBar: {
      fields: {
        products: {
          merge(_, incoming) {
            return incoming;
          },
        },
        foods: {
          merge(_, incoming) {
            return incoming;
          },
        },
        features: {
          merge(_, incoming) {
            return incoming;
          },
        },
        imgUrls: {
          merge(_, incoming) {
            return incoming;
          },
        },
      },
    },
    Product: {
      fields: {
        reservationLimits: {
          merge(_, incoming) {
            return incoming;
          },
        },
      },
    },
    Query: {
      fields: {
        favouriteBeachBars: {
          merge(_, incoming: any[]) {
            return incoming;
          },
        },
        customerPaymentMethods: {
          merge(_, incoming: any[]) {
            return incoming;
          },
        },
        foods: {
          merge(_, incoming) {
            return incoming;
          },
        },
      },
    },
  } as TypedTypePolicies,
});

export const userIpAddr = makeVar<IpAddrType | null>(null);
// {
//   city: "",
//   country: "",
//   countryCode: "",
//   currency: "",
//   district: "",
//   lat: 0,
//   lon: 0,
//   mobile: false,
//   query: "",
//   region: "",
//   regionName: "",
//   status: "",
//   timezone: "",
//   zip: "",
// }
