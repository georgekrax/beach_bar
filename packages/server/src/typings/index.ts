import { PrismaClient } from "@prisma/client";
import { MailService } from "@sendgrid/mail";
import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { Redis } from "ioredis";
import { Stripe } from "stripe";

export type NonReadonly<T> = { -readonly [P in keyof T]: T[P] };
export type NullableNested<T> = { [P in keyof T]?: T[P] | null };

export type ErrorType = {
  error?: {
    code?: string;
    message: string;
  };
};

// export type ErrorListType = {
//   error?: {
//     code?: string;
//     message: string;
//   };
// }[];

export type AddType = {
  added: boolean;
};

export type UpdateType = {
  updated: boolean;
};

export type DeleteType =
  | {
      deleted: boolean;
    }
  | ErrorType;

export type TDelete = {
  deleted: boolean;
};

// export type SuccessType =
// | ErrorType
// | {
//   success: boolean;
// };

// export type TSuccess = {
//   success: boolean;
// };

export type SuccessObjectType = {
  success: boolean;
};

// export type LoginDetailsType = {
//   osId?: number;
//   browserId?: number;
//   countryAlpha2Code?: string;
//   countryId?: number;
//   city?: string;
// };

export interface MyContext {
  req: Request;
  res: Response;
  payload?: {
    scope: string[];
    iat: number;
    exp: number;
    aud: string;
    iss: string;
    sub: number;
    jti: string;
  };
  redis: Redis;
  prisma: PrismaClient;
  sgMail: MailService;
  sgClient: any;
  stripe: Stripe;
  uaParser: UAParser;
  googleOAuth2Client: OAuth2Client;
  ipAddr?: string;
}

// process.env
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      PEER_DEPENDENCY_CHECK: string;
      NODE_ENV: string;
      TS_NODE_PROJECT: string;
      PORT: number;
      USER_PERSONALIZED_BEACH_BARS_LENGTH: number;
      MAX_PRODUCT_QUANTITY: number;
      HOSTNAME_WITH_HTTP: string;
      CART_COOKIE_NAME: string;

      JWT_COOKIE_NAME: string;
      JWT_SECRET: string;
      SESSION_SECRET: string;
      ACCESS_TOKEN_EXPIRATION: string;
      ACCESS_TOKEN_COOKIE_NAME: string;
      ACCESS_TOKEN_SECRET: string;
      REFRESH_TOKEN_EXPIRATION: string;
      REFRESH_TOKEN_COOKIE_NAME: string;
      REFRESH_TOKEN_SECRET: string;
      TOKEN_AUDIENCE: string;
      TOKEN_ISSUER: string;

      AWS_ACCESS_KEY_ID: string;
      AWS_SECRET_ACCESS_KEY: string;
      AWS_ACCESS_KEY_ID_georgekrax: string;
      AWS_SECRET_ACCESS_KEY_georgekrax: string;
      AWS_S3_HOSTNAME: string;

      GOOGLE_OAUTH_CLIENT_ID: string;
      GOOGLE_OAUTH_CLIENT_SECRET: string;
      GOOGLE_OAUTH_REDIRECT_URI: string;
      HASHTAG_CLIENT_ID: string;
      HASHTAG_CLIENT_SECRET: string;
      HASHTAG_ORIGIN_URI: string;
      HASHTAG_REDIRECT_URI: string;
      HASHTAG_TOKEN_ISSUER: string;
      HASHTAG_API_HOSTNAME: string;
      HASHTAG_GRAPHQL_ENDPOINT: string;
      FACEBOOK_APP_ID: string;
      FACEBOOK_APP_SECRET: string;
      FACEBOOK_APP_ACCESS_TOKEN: string;
      FACEBOOK_APP_NAME: string;
      FACEBOOK_GRAPH_API_HOSTNAME: string;
      FACEBOOK_REDIRECT_URI: string;
      INSTAGRAM_APP_ID: string;
      INSTAGRAM_APP_SECRET: string;
      INSTAGRAM_REDIRECT_URI: string;
      INSTAGRAM_API_HOSTNAME: string;
      INSTAGRAM_GRAPH_API_HOSTNAME: string;

      SENDGRID_API_KEY: string;
      SENDGRID_EMAIL_ADDRESS: string;
      STRIPE_PUBLIC_KEY: string;
      STRIPE_PUBLIC_LIVE_KEY: string;
      STRIPE_SECRET_KEY: string;
      STRIPE_SECRET_LIVE_KEY:string;
      STRIPE_OAUTH_CLIENT_ID:string;
      STRIPE_CONNECT_OAUTH_REDIRECT_URI: string;
      STRIPE_WEBHOOKS_SECRET: string;
      STRIPE_PAYMENT_WEBHOOKS_SECRET: string;
      STRIPE_WEBHOOK_ORIGIN_URL: string;
    }
  }
}
