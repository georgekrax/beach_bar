import { User } from "../../entity/User";
import { AddType, SuccessType, UpdateType } from "../returnTypes";

export type UserSignUpType = AddType & {
  user: User;
};

export type UserLogoutType = SuccessType;

export type UserLoginType = SuccessType & {
  user: User;
  accessToken: string;
};

export type UserForgotPasswordType = SuccessType & {
  user: User | User;
};

export type UserUpdateType = UpdateType & {
  user: User;
};
