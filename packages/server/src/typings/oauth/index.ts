import { User } from "entity/User";

export type AuthorizeWithOAuthType = {
  user: User;
  accessToken: string;
  signedUp: boolean;
  logined: boolean;
};
