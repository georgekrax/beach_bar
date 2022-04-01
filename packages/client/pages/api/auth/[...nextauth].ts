import {
  AuthorizeDocument,
  AuthorizeMutation,
  AuthorizeMutationVariables,
  LoginDocument,
  LoginMutation,
  LoginMutationVariables,
  LogoutDocument,
  LogoutMutation,
  LogoutMutationVariables,
  OAuthProvider,
} from "@/graphql/generated";
import { initializeApollo } from "@/lib/apollo";
import { decodeJwt, JwtPayload, signJwt, verifyJwt } from "@beach_bar/common";
import dayjs from "dayjs";
import ms from "ms";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import InstagramProvider from "next-auth/providers/instagram";

const apolloClient = initializeApollo();

const parseGraphQLRes = (data: LoginMutation | AuthorizeMutation, key: "login" | "authorize") => {
  const {
    // @ts-expect-error
    [key]: {
      __typename: _,
      user: { __typename: __, account, ...user },
      ...login
    },
  } = data;
  return { ...login, ...user, imgUrl: account?.imgUrl };
};

const refreshAccessToken = async (token: JWT) => {
  try {
    const url = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT + "/oauth/refresh_token";
    const res = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: { "x-refetch-token": String(token.refreshToken) },
    });

    const data = await res.json();
    if (!res.ok) throw data;

    return {
      ...token,
      accessToken: data.accessToken?.token,
      refreshToken: data.refreshToken?.token ?? token.refreshToken,
      exp: (data.accessToken?.expirationDate || 0) / 1000,
    };
  } catch (error) {
    return { ...token, error: "RefreshAccessTokenError" };
  }
};

// authorize -> signIn -> jwt -> encode -> decode -> jwt -> session -> encode
// signIn
// signIn
export const config: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile(profile: any) {
        return {
          id: profile.sub,
          email: profile.email,
          firstName: profile.given_name,
          lastName: profile.family_name,
          image: profile.picture,
        };
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      userinfo: { params: { fields: "id,email,first_name,last_name,birthday,picture{is_silhouette,url}" } },
      profile(profile: any) {
        return {
          ...profile,
          firstName: profile.first_name,
          lastName: profile.last_name,
          is_silhouette: profile.picture.data.is_silhouette,
          image: profile.picture.data.url,
        };
      },
    }),
    InstagramProvider({
      clientId: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
      // userInfo: "https://graph.instagram.com/me?fields=id,username,account_type,name",
      // userInfo: {
      //   url: "https://graph.instagram.com/me?fields=id,username,account_type,name",
      //   async request(me) {
      //     console.log(me);
      //   },
      // },
      // profile(profile: any) {
      //   console.log("profile")
      //   console.log(profile)
      //   return {
      //     ...profile,
      //     firstName: profile.first_name,
      //     lastName: profile.last_name,
      //   };
      // },
    }),
    GithubProvider({
      clientId: "b5082b8898654db6dca9",
      clientSecret: "4924f08c72935c24b98ae8c7ce4ae0b1a03cded8",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: { label: "Password", type: "password", placeholder: "Password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const { email, password } = credentials;
        const { data, errors } = await apolloClient.mutate<LoginMutation, LoginMutationVariables>({
          mutation: LoginDocument,
          // TODO: Add login details
          variables: { userCredentials: { email, password } },
        });
        if (errors || !data) throw new Error(errors?.[0].message || "Something went wrong");
        return parseGraphQLRes(data, "login");
      },
    }),
  ],
  secret: process.env.SESSION_SECRET,
  session: {
    maxAge: ms(process.env.REFRESH_TOKEN_EXPIRATION) / 1000,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    async encode({ token, secret }) {
      const { jwt } = await signJwt(token || {}, secret, token => {
        return token.setAudience(process.env.TOKEN_AUDIENCE).setIssuer(process.env.TOKEN_ISSUER);
      });
      return jwt;
    },
    async decode({ token, secret }) {
      return decodeJwt(token || "", secret);
    },
  },
  events: {
    async signOut({ token }) {
      await apolloClient.mutate<LogoutMutation, LogoutMutationVariables>({
        mutation: LogoutDocument,
        context: { headers: { Authorization: "Bearer " + token.accessToken } },
      });
    },
  },
  cookies: {
    sessionToken: {
      name: process.env.JWT_NAME,
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: true },
    },
  },
  callbacks: {
    // Persist the OAuth access_token to the token right after signin
    async jwt({ token, user }) {
      if (user) {
        const { id, ...rest } = (user.me || user) as any;
        const { payload } = await verifyJwt(String(rest.accessToken), process.env.ACCESS_TOKEN_SECRET);
        return { ...rest, sub: id, exp: payload.exp };
      }

      const { exp = 0 } = token as JwtPayload;
      // console.log("exp", exp, Math.floor(new Date().getTime() / 1000));

      // console.log(dayjs().unix(), exp);
      if (dayjs().unix() < exp) return token;

      // Refresh
      return await refreshAccessToken(token);
    },
    async signIn({ user: userArg, account }) {
      const user = userArg as any;
      let provider: OAuthProvider = OAuthProvider.Hashtag;
      switch (account.provider.toLowerCase()) {
        case "github":
          provider = OAuthProvider.GitHub;
          break;
        case "google":
          provider = OAuthProvider.Google;
          break;
        case "facebook":
          provider = OAuthProvider.Facebook;
          break;
        case "instagram":
          provider = OAuthProvider.Instagram;
          break;
      }

      const apolloClient = initializeApollo();
      const { data } = await apolloClient.mutate<AuthorizeMutation, AuthorizeMutationVariables>({
        mutation: AuthorizeDocument,
        // TODO: Add login details
        variables: {
          provider,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            birthday: user.birthday,
            imgUrl: user?.is_silhouette ? undefined : user?.image,
          },
        },
      });
      if (!data) return false;
      userArg.me = parseGraphQLRes(data, "authorize");
      return true;
    },
    // Send properties to the client, like an access_token from a provider.
    async session({ session, token }) {
      if (session.user) {
        session = { ...session, ...session.user };
        session.user = undefined;
        session.id = token.sub;
        session.firstName = token.firstName;
        session.lastName = token.lastName;
        session.fullName = token.fullName;
        session.image = token.imgUrl;
        session.expires = dayjs
          .unix(+String(token.exp))
          .toDate()
          .toISOString();
        // session.exp = token.exp;
      }
      return session;
    },
  },
};

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  // Do whatever you want here, before the request is passed down to `NextAuth`
  return await NextAuth(req, res, config);
}
