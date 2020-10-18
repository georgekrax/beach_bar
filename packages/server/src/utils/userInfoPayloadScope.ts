import { User } from "../entity/User";
import { UserType } from "../typings/user";

export const userInfoPayloadScope = (payload: any, user: User): UserType => {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    reviews: payload.scope.some(scope =>
      ["beach_bar@crud:user", "beach_bar@crud:user_review", "hashtag@read:user_review"].includes(scope)
    )
      ? user.customer && user.customer.reviews
      : undefined,
    account: payload.scope.some(scope => ["beach_bar@crud:user", "beach_bar@read:user_account"].includes(scope))
      ? {
          id: user.account.id,
          user: user,
          userId: user.id,
          personTitle: payload.scope.some(
            scope => ["beach_bar@crud:user", "hashtag@read:user_account:person_title"].includes(scope) && user.account.personTitle
          )
            ? user.account.personTitle
            : undefined,
          imgUrl: user.account.imgUrl && user.account.imgUrl,
          birthday: payload.scope.some(
            scope => ["beach_bar@crud:user", "hashtag@read:user_account:birthday_and_age"].includes(scope) && user.account.birthday
          )
            ? user.account.birthday
            : undefined,
          age: payload.scope.some(
            scope => ["beach_bar@crud:user", "hashtag@read:user_account:birthday_and_age"].includes(scope) && user.account.age
          )
            ? user.account.age
            : undefined,
          country: payload.scope.some(
            scope => ["beach_bar@crud:user", "hashtag@read:user_account:country"].includes(scope) && user.account.country
          )
            ? user.account.country
            : undefined,
          countryId: payload.scope.some(
            scope => ["beach_bar@crud:user", "hashtag@read:user_account:country"].includes(scope) && user.account.country
          )
            ? user.account.country?.id
            : undefined,
          city: payload.scope.some(
            scope => ["beach_bar@crud:user", "hashtag@read:user_account:city"].includes(scope) && user.account.city
          )
            ? user.account.city
            : undefined,
          cityId: payload.scope.some(
            scope => ["beach_bar@crud:user", "hashtag@read:user_account:city"].includes(scope) && user.account.city
          )
            ? user.account.city?.id
            : undefined,
          address: payload.scope.some(
            scope => ["beach_bar@crud:user", "beach_bar@read:user_account:address"].includes(scope) && user.account.address
          )
            ? user.account.address
            : undefined,
          zipCode: payload.scope.some(
            scope => ["beach_bar@crud:user", "beach_bar@read:user_account:zip_code"].includes(scope) && user.account.zipCode
          )
            ? user.account.zipCode
            : undefined,
          contactDetails: payload.scope.some(
            scope => ["beach_bar@crud:user", "beach_bar@read:user_contact_details"].includes(scope) && user.account.contactDetails
          )
            ? user.account.contactDetails
            : undefined,
        }
      : undefined,
  };
};
