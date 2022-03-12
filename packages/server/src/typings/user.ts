import { Account } from "@/entity/Account";
import { BeachBarReview } from "@/entity/BeachBarReview";
import { User } from "@/entity/User";

export type TUser = {
  reviews?: BeachBarReview[];
  account?: Partial<
    Pick<
      Account,
      | "birthday"
      | "phoneNumber"
      | "city"
      | "trackHistory"
      | "zipCode"
      | "address"
      | "country"
      | "countryId"
      | "age"
      | "imgUrl"
      | "honorificTitle"
      | "user"
      | "userId"
      | "id"
    >
  >;
} & Pick<User, "id" | "email" | "firstName" | "lastName" | "reviewVotes">;

export type UpdateUserInfo = Partial<
  Pick<
    Account,
    | "birthday"
    | "phoneNumber"
    | "telCountryId"
    | "zipCode"
    | "trackHistory"
    | "city"
    | "countryId"
    | "address"
    | "honorificTitle"
    | "imgUrl"
  >
> &
  Pick<User, "firstName" | "lastName" | "email">;

export type TUserReturn = {
  user: User;
};

export type TUserLogin = TUserReturn & { accessToken: string };
