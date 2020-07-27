import { BeachBarReview } from "@entity/BeachBarReview";
import { City } from "@entity/City";
import { Country } from "@entity/Country";
import { User } from "@entity/User";
import { UserContactDetails } from "@entity/UserContactDetails";
import { AddType, ErrorType, SuccessType, UpdateType } from "@typings/.index";
import { Dayjs } from "dayjs";

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
    birthday?: Dayjs;
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

export interface UpdateUserInfo {
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  imgUrl?: string;
  personTitle?: string;
  birthday?: Dayjs;
  address?: string;
  zipCode?: string;
  countryId?: number;
  cityId?: number;
  preferenceIds?: number[];
}

type UserReturnType = {
  user: User;
};

export type UserLoginType =
  | (SuccessType &
      UserReturnType & {
        accessToken: string;
      })
  | ErrorType;

export type UserSignUpType = (AddType & UserReturnType) | ErrorType;

export type UpdateUserType = (UpdateType & UserReturnType) | ErrorType;
