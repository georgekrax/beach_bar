import { StringValue } from "ms";

export type NonReadonly<T> = { -readonly [P in keyof T]: T[P] };

// process.env
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ANALYZE: boolean;
      NEXT_PUBLIC_GRAPHQL_ENDPOINT: string;
      NEXT_PUBLIC_MAPBOX_TOKEN: string;
      NEXT_PUBLIC_MAPBOX_API_URL: string;
      NEXT_PUBLIC_STRIPE_PUBLIC_KEY: string;
      NEXT_PUBLIC_STRIPE_CLIENT_ID: string;

      JWT_NAME: string;
      JWT_SECRET: string;
      SESSION_SECRET: string;
      ACCESS_TOKEN_SECRET: string;
      REFRESH_TOKEN_EXPIRATION: StringValue;
      TOKEN_AUDIENCE: string;
      TOKEN_ISSUER: string;

      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string
      FACEBOOK_CLIENT_ID: string;
      FACEBOOK_CLIENT_SECRET: string;
      INSTAGRAM_CLIENT_ID: string;
      INSTAGRAM_CLIENT_SECRET: string;
    }
  }
}
