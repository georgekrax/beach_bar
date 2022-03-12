import { isAuth, throwScopesUnauthorized } from "@/utils/auth";
import { updateRedis } from "@/utils/db";
import { errors, TABLES } from "@beach_bar/common";
import { ApolloError } from "apollo-server-express";
import { extendType, idArg, list } from "nexus";
import { BeachBarStyleType } from "./types";

export const BeachBarStyleCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.list.field("addBeachBarStyles", {
      type: BeachBarStyleType,
      description: "Add (assign) styles to a #beach_bar",
      args: { beachBarId: idArg(), styleIds: list(idArg()) },
      resolve: async (_, { beachBarId, styleIds }, { prisma, payload }) => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to add a style to a #beach_bar.", ["beach_bar@crud:beach_bar"]);

        const styles = TABLES.BEACH_BAR_STYLE.filter(({ id }) => styleIds.map(val => val.toString()).includes(id.toString()));
        if (styles.length === 0) throw new ApolloError("Invalid style", errors.NOT_FOUND);

        try {
          const newBarStyles = await prisma.beachBar.update({ where: { id: +beachBarId },include: {styles: true}, data: { styles: { set: styles } } });
          // await prisma.$transaction(
          //   styles.map(style =>
          //     prisma.beachBarType.create({
          //       include: { style: true },
          //       data: { beachBarId: +beachBarId, styleId: style.id, deletedAt: null },
          //     })
          //   )
          // );

          await updateRedis({ model: "BeachBar", id: +beachBarId });
          return newBarStyles.styles;
        } catch (err) {
          throw new ApolloError(err.message);
        }
      },
    });
    t.boolean("deleteBeachBarStyles", {
      description: "Delete (remove) styles from a #beach_bar",
      args: { beachBarId: idArg(), styleIds: list(idArg()) },
      resolve: async (_, __, { payload }) => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to delete a style from a #beach_bar", ["beach_bar@crud:beach_bar"]);

        // const barTypes = await BeachBarType.find({ where: { beachBarId, styleId: In(styleIds) }, relations: ["beachBar"] });
        // if (barTypes.length === 0) throw new ApolloError("Invalid style", errors.NOT_FOUND);

        try {
          // TODO: Fix
          // for (const element of barTypes) {
          //   await element.softRemove();
          // }
          // await updateRedis({ model: "BeachBar", id: barTypes[0].beachBarId });
        } catch (err) {
          throw new ApolloError(err.message);
        }

        return true;
      },
    });
  },
});
