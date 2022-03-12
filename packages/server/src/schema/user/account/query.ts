import { checkScopes } from "@/utils/auth";
import { errors } from "@beach_bar/common";
import { ApolloError } from "apollo-server-express";
import { extendType } from "nexus";
import { UserHistoryExtendedType } from "./types";

export const UserAccountQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("userHistory", {
      type: UserHistoryExtendedType,
      description: "Returns a list of user's recorded / saved history",
      resolve: async (_, __, { prisma, payload }) => {
        if (!payload?.sub) throw new ApolloError(errors.NOT_AUTHENTICATED_MESSAGE, errors.NOT_AUTHENTICATED_CODE);
        if (!checkScopes(payload, ["beach_bar@crud:user"])) {
          throw new ApolloError(errors.NOT_AUTHENTICATED_MESSAGE, errors.UNAUTHORIZED_CODE);
        }

        const history = await prisma.userHistory.findMany({
          take: 15,
          where: { userId: payload.sub },
          orderBy: { timestamp: "desc" },
        });
        const res = await Promise.all(
          history.map(async userHistory => {
            if (!userHistory.objectId) return { userHistory };
            const { activityId, objectId } = userHistory;
            switch (activityId.toString()) {
              case "1":
                const search = await prisma.userSearch.findUnique({ where: { id: BigInt(objectId || 0) } });
                return { userHistory, search };
              case "2":
                const beachBar = await prisma.beachBar.findUnique({ where: { id: +objectId.toString() } });
                return { userHistory, beachBar };

              default:
                return { userHistory };
            }
          })
        );

        return res as any;
      },
    });
  },
});
