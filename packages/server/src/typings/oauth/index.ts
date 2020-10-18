import { User } from "entity/User";
import { ErrorType } from "typings/.index";

export type AuthorizeWithOAuthType =
  | {
      user: User;
      accessToken: string;
      signedUp: boolean;
      logined: boolean;
    }
  | ErrorType;
