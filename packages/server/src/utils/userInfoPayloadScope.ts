import { MyContext } from "@beach_bar/common";
import { Prisma } from "@prisma/client";

// userInfoPayloadScope()
export const UserInfoPayloadScopeInclude = Prisma.validator<Prisma.UserInclude>()({
  account: { include: { country: true } },
  customer: { include: { reviews: true } },
});
type UserInfoPayloadScopeModel = Prisma.UserGetPayload<{ include: typeof UserInfoPayloadScopeInclude }>;

export const userInfoPayloadScope = ({ scope }: NonNullable<MyContext["payload"]>, user: UserInfoPayloadScopeModel) => {
  const { id, account, customer } = user;

  return {
    ...user,
    reviews: scope.some(scope => ["beach_bar@crud:user", "beach_bar@crud:user_review", "hashtag@read:user_review"].includes(scope))
      ? customer && customer.reviews
      : undefined,
    account: scope.some(scope => ["beach_bar@crud:user", "beach_bar@read:user_account"].includes(scope))
      ? {
          id: account?.id,
          user,
          userId: id,
          honorificTitle: scope.some(
            scope => ["beach_bar@crud:user", "hashtag@read:user_account:person_title"].includes(scope) && user.account?.honorificTitle
          )
            ? account?.honorificTitle
            : undefined,
          imgUrl: account?.imgUrl,
          birthday: scope.some(
            scope =>
              ["beach_bar@crud:user", "hashtag@read:user_account:birthday_and_age"].includes(scope) &&
              user.account?.birthday?.toString() !== "none"
          )
            ? account?.birthday
            : undefined,
          age: scope.some(
            scope => ["beach_bar@crud:user", "hashtag@read:user_account:birthday_and_age"].includes(scope) && account?.age
          )
            ? account?.age
            : undefined,
          country: scope.some(
            scope => ["beach_bar@crud:user", "hashtag@read:user_account:country"].includes(scope) && account?.country
          )
            ? account?.country
            : undefined,
          countryId: scope.some(
            scope => ["beach_bar@crud:user", "hashtag@read:user_account:country"].includes(scope) && account?.country
          )
            ? account?.country?.id
            : undefined,
          city: scope.some(scope => ["beach_bar@crud:user", "hashtag@read:user_account:city"].includes(scope) && account?.city)
            ? account?.city
            : undefined,
          address: scope.some(
            scope => ["beach_bar@crud:user", "beach_bar@read:user_account:address"].includes(scope) && account?.address
          )
            ? account?.address
            : undefined,
          zipCode: scope.some(
            scope => ["beach_bar@crud:user", "beach_bar@read:user_account:zip_code"].includes(scope) && account?.zipCode
          )
            ? account?.zipCode
            : undefined,
          phoneNumber: scope.some(
            scope => ["beach_bar@crud:user", "beach_bar@read:user_account:phone_number"].includes(scope) && account?.phoneNumber
          )
            ? account?.phoneNumber
            : undefined,
          trackHistory: scope.some(scope => ["beach_bar@crud:user", "beach_bar@read:user_account"].includes(scope))
            ? account?.trackHistory
            : undefined,
        }
      : undefined,
  };
};
