<<<<<<< HEAD
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
=======
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
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
