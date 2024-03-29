import { IpAddrType } from "@/typings/graphql";
import { InMemoryCache, makeVar } from "@apollo/client";
import { TypedTypePolicies } from "./apollo-helpers";

export const cache = new InMemoryCache({
  typePolicies: {
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
    Query: {
      fields: {
        favouriteBeachBars: {
          merge(_, incoming: any[]) {
            return incoming;
          },
        },
      },
    },
  } as TypedTypePolicies,
});

export const userIpAddr = makeVar<IpAddrType>({
  city: "",
  country: "",
  countryCode: "",
  currency: "",
  district: "",
  lat: 0,
  lon: 0,
  mobile: false,
  query: "",
  region: "",
  regionName: "",
  status: "",
  timezone: "",
  zip: "",
});
