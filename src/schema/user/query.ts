import { stringArg, extendType, intArg } from "@nexus/schema";

import { UserType } from "./type";
import { User } from "./../../entity/User";

export const UsersQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("users", {
      type: UserType,
      description: "Returns a list of all available users",
      resolve: async () => {
        const users = await User.find({
          select: ["id", "email", "firstName", "lastName", "accountId"],
        });
        return users;
      },
    });
    t.field("user", {
      type: UserType,
      description: "Returns a single user",
      args: {
        id: intArg({ description: "A user's id " }),
        email: stringArg({ description: "A user's email" }),
      },
      resolve: async (_, args) => {
        if (!args.id && !args.email) {
          throw new Error("Id or email of the user should be provided");
        }

        const user = await User.findOne({
          ...args,
          select: ["id", "email", "firstName", "lastName", "accountId"],
        });
        return user;
      },
    });
  },
});
