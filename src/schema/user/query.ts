import { extendType } from "@nexus/schema";
import { MyContext } from "../../common/myContext";
import errors from "../../constants/errors";
import { ErrorType } from "../returnTypes";
import { User } from "./../../entity/User";
import { UserType } from "./returnTypes";
import { UserTypeResult } from "./types";

export const UsersQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("me", {
      type: UserTypeResult,
      description: "Returns current authenticated user",
      resolve: async (_, __, { payload }: MyContext): Promise<UserType | ErrorType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (
          !payload.scope.some(scope => ["profile", "beach_bar@crud:user", "beach_bar@read:user"].includes(scope)) ||
          !payload.scope.includes("email")
        ) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: "You are not allowed to access 'this' user's info",
            },
          };
        }

        const user = await User.findOne({
          where: { id: payload.sub },
          relations: [
            "account",
            "account.contactDetails",
            "account.country",
            "account.city",
            "owner",
            "owner.user",
            "owner.beachBars",
            "reviews",
            "reviews.visitType",
          ],
        });
        if (!user) {
          return {
            error: {
              code: errors.NOT_FOUND,
              message: errors.USER_NOT_FOUND_MESSAGE,
            },
          };
        }

        return {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          reviews: payload.scope.some(scope => ["beach_bar@crud:user", "hashtag@read:user_review"].includes(scope) && user.reviews)
            ? user.reviews
            : undefined,
          account: payload.scope.some(scope => ["beach_bar@crud:user", "beach_bar@read:user_account"].includes(scope))
            ? {
                id: user.account.id,
                user: user,
                userId: user.id,
                personTitle: payload.scope.some(
                  scope =>
                    ["beach_bar@crud:user", "hashtag@read:user_account:person_title"].includes(scope) && user.account.personTitle,
                )
                  ? user.account.personTitle
                  : undefined,
                imgUrl: user.account.imgUrl && user.account.imgUrl,
                birthday: payload.scope.some(
                  scope =>
                    ["beach_bar@crud:user", "hashtag@read:user_account:birthday_and_age"].includes(scope) && user.account.birthday,
                )
                  ? user.account.birthday
                  : undefined,
                age: payload.scope.some(
                  scope => ["beach_bar@crud:user", "hashtag@read:user_account:birthday_and_age"].includes(scope) && user.account.age,
                )
                  ? user.account.age
                  : undefined,
                country: payload.scope.some(
                  scope => ["beach_bar@crud:user", "hashtag@read:user_account:country"].includes(scope) && user.account.country,
                )
                  ? user.account.country
                  : undefined,
                countryId: payload.scope.some(
                  scope => ["beach_bar@crud:user", "hashtag@read:user_account:country"].includes(scope) && user.account.country,
                )
                  ? user.account.country.id
                  : undefined,
                city: payload.scope.some(
                  scope => ["beach_bar@crud:user", "hashtag@read:user_account:city"].includes(scope) && user.account.city,
                )
                  ? user.account.city
                  : undefined,
                cityId: payload.scope.some(
                  scope => ["beach_bar@crud:user", "hashtag@read:user_account:city"].includes(scope) && user.account.city,
                )
                  ? user.account.city.id
                  : undefined,
                address: payload.scope.some(
                  scope => ["beach_bar@crud:user", "beach_bar@read:user_account:address"].includes(scope) && user.account.address,
                )
                  ? user.account.address
                  : undefined,
                zipCode: payload.scope.some(
                  scope => ["beach_bar@crud:user", "beach_bar@read:user_account:zip_code"].includes(scope) && user.account.zipCode,
                )
                  ? user.account.zipCode
                  : undefined,
                contactDetails: payload.scope.some(
                  scope =>
                    ["beach_bar@crud:user", "beach_bar@read:user_contact_details"].includes(scope) && user.account.contactDetails,
                )
                  ? user.account.contactDetails
                  : undefined,
              }
            : undefined,
        };
      },
    });
  },
});
