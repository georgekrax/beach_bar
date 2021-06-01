import { errors, MyContext } from "@beach_bar/common";
import { ApolloError } from "apollo-server-express";
import { BeachBar } from "entity/BeachBar";
import { UserHistory } from "entity/UserHistory";
import { UserSearch } from "entity/UserSearch";
import { extendType } from "nexus";
import { TUserHistoryExtended } from "typings/user";
import { checkScopes } from "utils/checkScopes";
import { UserHistoryExtendedType } from "./types";

export const UserAccountQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("userHistory", {
      type: UserHistoryExtendedType,
      description: "Returns a list of user's recorded / saved history",
      resolve: async (_, __, { payload }: MyContext): Promise<TUserHistoryExtended[] | ApolloError> => {
        if (!payload || !payload.sub) throw new ApolloError(errors.NOT_AUTHENTICATED_MESSAGE, errors.NOT_AUTHENTICATED_CODE);
        if (!checkScopes(payload, ["beach_bar@crud:user"]))
          throw new ApolloError(errors.NOT_AUTHENTICATED_MESSAGE, errors.UNAUTHORIZED_CODE);

        const history = await UserHistory.find({ where: { userId: payload.sub }, relations: ["activity", "user", "user.account"] });
        const res: TUserHistoryExtended[] = await Promise.all(
          history.map(async ({ activityId, objectId, ...rest }) => {
            switch (activityId.toString()) {
              case "1":
                const search = await UserSearch.findOne({
                  where: { id: objectId },
                  relations: ["filters", "sort", "inputValue", "inputValue.region", "inputValue.city", "inputValue.country"],
                });
                return { userHistory: { activityId, objectId, ...rest } as UserHistory, search };
              case "2":
                const beachBar = await BeachBar.findOne({
                  where: { id: objectId },
                  relations: ["location", "location.region", "location.city", "location.country"],
                });
                return { userHistory: { activityId, objectId, ...rest } as UserHistory, beachBar };

              default:
                return { userHistory: { activityId, objectId, ...rest } as UserHistory };
            }
          })
        );

        return res;
      },
    });
  },
});
