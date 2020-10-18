import { Dayjs } from "dayjs";
import { BeachBarReview } from "entity/BeachBarReview";
import { City } from "entity/City";
import { Country } from "entity/Country";
import { User } from "entity/User";
import { UserContactDetails } from "entity/UserContactDetails";
import { ErrorType } from "typings/.index";

export type UserType = {
  id: number;
  email: string;
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
    cityId?: bigint;
    address?: string;
    zipCode?: string;
    contactDetails?: UserContactDetails[];
  };
};

export interface UpdateUserInfo {
  email: string;
  firstName?: string;
  lastName?: string;
  imgUrl?: string;
  personTitle?: string;
  birthday?: Dayjs;
  address?: string;
  zipCode?: string;
  countryId?: number;
  cityId?: bigint;
  trackHistory?: boolean;
}

type UserReturnType = {
  user: User;
};

export type UserLoginType = (UserReturnType & { accessToken: string }) | ErrorType;

export type UserSignUpType = UserReturnType | ErrorType;

export type UpdateUserType = UserReturnType | ErrorType;
