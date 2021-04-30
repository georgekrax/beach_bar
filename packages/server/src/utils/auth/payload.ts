import { errors, MyContext } from "@beach_bar/common";
import { ApolloError } from "apollo-server-express";
import { checkScopes } from "utils/checkScopes";

export const isAuth = (payload: MyContext["payload"]) => {
  if (!payload) throw new ApolloError(errors.NOT_AUTHENTICATED_MESSAGE, errors.NOT_AUTHENTICATED_CODE);
};

export const throwScopesUnauthorized = (payload: MyContext["payload"], msg: string, scopes: string[]) => {
  if (!checkScopes(payload, scopes)) throw new ApolloError(msg, errors.UNAUTHORIZED_CODE);
};
