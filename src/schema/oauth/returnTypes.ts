import { User } from "../../entity/User";

export type AuthorizeWithGoogleType = {
  user: User;
  accessToken: string;
  signedUp: boolean;
  logined: boolean;
};
