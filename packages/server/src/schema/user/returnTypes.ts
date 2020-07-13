import { BeachBarReview } from "../../entity/BeachBarReview";
import { City } from "../../entity/City";
import { Country } from "../../entity/Country";
import { User } from "../../entity/User";
import { Dayjs } from "dayjs";
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

export interface UpdateUser {
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
}

export type UserSignUpType = AddType & {
  user: User;
};

export type UserLoginType = SuccessType & {
  user: User;
  accessToken: string;
};

export type UserUpdateType = UpdateType & {
  user: User;
};
