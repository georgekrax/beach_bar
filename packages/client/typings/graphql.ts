import { GraphQLError } from "graphql";

export type IpAddrType = {
  city: string;
  country: string;
  countryCode: string;
  currency: string;
  district: string;
  lat: number;
  lon: number;
  mobile: boolean;
  query: string;
  region: string;
  regionName: string;
  status: string;
  timezone: string;
  zip: string;
};

export type ApolloGraphQLErrors = readonly GraphQLError[] | undefined;