import { resolve } from "@/utils/data";
import { getFullName } from "@/utils/user";
import { inputObjectType, objectType, unionType } from "nexus";
import { LoginDetails, User } from "nexus-prisma";
import { BeachBarReviewType } from "../beach_bar/review/types";

export const UserType = objectType({
  name: User.$name,
  description: "Represents a user",
  definition(t) {
    // t.id("id", { description: "User's ID value" });
    // t.field("email", { type: EmailScalar, description: "User's email address" });
    // t.nullable.string("firstName", { description: "User's first (given) name" });
    // t.nullable.string("lastName", { description: "User's last (family) name" });
    // t.field("account", {
    //   type: UserAccountType,
    //   description: "User's account info",
    //   resolve: async ({ id, account }, _, { prisma }: MyContext) => {
    // return prisma.user.findUnique({ where: { id }, include: { account: true } });
    //     if (account) return account;
    //     const hey = await prisma.user.findUnique({ where: { id } }).account();
    //     return hey;
    //   },
    // });
    // t.list.field("reviews", {
    //   type: BeachBarReviewType,
    //   description: "A user's review on a #beach_bar",
    // });
    // t.list.field("favoriteBars", {
    //   type: UserFavoriteBarType,
    //   description: "A list with all the user's favorite #beach_bars",
    // });
    // t.list.field("reviewVotes", {
    //   type: ReviewVoteType,
    //   description: "A list of all the votes of the user",
    // });
    t.field(User.id);
    t.field(User.email);
    t.field(User.firstName);
    t.field(User.lastName);
    t.field(resolve(User.account));
    t.field(resolve(User.reviewVotes));
    t.field(resolve(User.favoriteBars));
    t.nullable.string("fullName", { description: "User's first and last name combines", resolve: getFullName });
    t.nullable.list.field("reviews", {
      type: BeachBarReviewType,
      description: "A user's review on a #beach_bar",
      resolve: o => o["customer"]["reviews"],
    });
  },
});

export const UserResult = unionType({
  name: "UserTypeResult",
  definition(t) {
    t.members("User", "Error");
  },
  resolveType: item => (item["error"] ? "Error" : "User"),
});

// export const UserSignUpResult = unionType({
//   name: "UserSignUpResult",
//   definition(t) {
//     t.members("User", "Error");
//   },
//   resolveType: item => {
//     if (item.error) {
//       return "Error";
//     } else {
//       return "User";
//     }
//   },
// });

export const LoginAuthorizeType = objectType({
  name: "LoginAuthorize",
  description: "User info to be returned on login",
  definition(t) {
    t.string("accessToken", { description: "The access token to authenticate & authorize the user" });
    t.string("refreshToken", { description: "The access token to authenticate & authorize the user" });
    t.boolean("isNewUser", { description: "A boolean that indicates if the user has also signed up, because it is a new one" });
    t.list.string("scope", { description: "A list of the user scopes" });
    t.field("user", { type: UserType, description: "The user (object) that logins" });
  },
});

// export const UserLoginResult = unionType({
//   name: "UserLoginResult",
//   definition(t) {
//     t.members("UserLogin", "Error");
//   },
//   resolveType: item => {
//     if (item.error) {
//       return "Error";
//     } else {
//       return "UserLogin";
//     }
//   },
// });

export const UserCredentials = inputObjectType({
  name: "UserCredentials",
  description: "Credentials of user to sign up / login",
  definition(t) {
    t.email("email", { description: "Email of user to sign up" });
    t.string("password", { description: "Password of user" });
  },
});

export const UserLoginDetails = inputObjectType({
  name: "UserLoginDetails",
  description: "User details in login. The user's IP address is passed via the context",
  definition(t) {
    // t.nullable.string("city", { description: "The city name from where user logins from" });
    t.field(LoginDetails.city);
    t.nullable.string("countryAlpha2Code", { description: "The alpha 2 code of the country, from where the user logins" });
  },
});

// export const UserUpdateType = objectType({
//   name: "UserUpdate",
//   description: "User details to be returned on update",
//   definition(t) {
//     t.implements(UpdateGraphQLType);
//     t.field("user", { type: UserType });
//   },
// });

// export const UserUpdateResult = unionType({
//   name: "UserUpdateResult",
//   definition(t) {
//     t.members("User", "Error");
//   },
//   resolveType: item => {
//     if (item.error) {
//       return "Error";
//     } else {
//       return "User";
//     }
//   },
// });
