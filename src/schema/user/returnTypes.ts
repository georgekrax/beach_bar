import { BeachBarReview } from "../../entity/BeachBarReview";
import { City } from "../../entity/City";
import { Country } from "../../entity/Country";
import { User } from "../../entity/User";
import { UserContactDetails } from "../../entity/UserContactDetails";
import { AddType, SuccessType, UpdateType } from "../returnTypes";

export type UserType = {
  id: number;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  reviews?: BeachBarReview[];
  account?: {
    id: number;
    user: User;
    userId: number;
    personTitle?: string;
    imgUrl?: string;
    birthday?: Date;
    age?: number;
    country?: Country;
    countryId?: number;
    city?: City;
    cityId?: number;
    address?: string;
    zipCode?: string;
    contactDetails?: UserContactDetails[];
  };
};

export type UserSignUpType = AddType & {
  user: User;
};

export type UserLoginType = SuccessType & {
  user: User;
  accessToken: string;
};

export type UserForgotPasswordType = SuccessType & {
  user: User;
};

export type UserUpdateType = UpdateType & {
  user: User;
};
