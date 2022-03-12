import { isAuth, throwScopesUnauthorized } from "@/utils/auth";
import { updateRedis } from "@/utils/db";
import { errors } from "@beach_bar/common";
import { UrlScalar } from "@the_hashtag/common/dist/graphql";
import { ApolloError } from "apollo-server-express";
import { arg, extendType, idArg, nullable, stringArg } from "nexus";
import { BeachBarImgUrlType } from "./types";

export const BeachBarImgUrlCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addBeachBarImgUrl", {
      type: BeachBarImgUrlType,
      description: "Add an image (URL) to a #beach_bar",
      args: {
        beachBarId: idArg(),
        imgUrl: arg({ type: UrlScalar.name, description: "The URL value of the image" }),
        description: nullable(
          stringArg({
            description:
              "A short description about what the image represents. The characters of the description should not exceed the number 175",
          })
        ),
      },
      resolve: async (_, { beachBarId, ...args }, { prisma, payload }) => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to add an image to a #beach_bar", [
          "beach_bar@crud:beach_bar",
          "beach_bar@crud:beach_bar_img_url",
        ]);

        try {
          const newImg = await prisma.beachBarImgUrl.create({ data: { ...args, beachBarId: +beachBarId } });
          await updateRedis({ model: "BeachBar", id: +beachBarId });
          return newImg;
        } catch (err) {
          throw new ApolloError(err.message);
        }
      },
    });
    t.field("updateBeachBaImgUrl", {
      type: BeachBarImgUrlType,
      description: "Update the details of a #beach_bar's image",
      args: { id: idArg(), description: nullable(stringArg()) },
      resolve: async (_, { id, description }, { prisma, payload }) => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to update an image of a #beach_bar", [
          "beach_bar@crud:beach_bar",
          "beach_bar@crud:beach_bar_img_url",
          "beach_bar@update:beach_bar_img_url",
        ]);

        try {
          const updatedImg = await prisma.beachBarImgUrl.update({
            where: { id: BigInt(id) },
            data: { description: description?.trim().length === 0 ? undefined : description },
          });
          await updateRedis({ model: "BeachBar", id: updatedImg.beachBarId });
          return updatedImg;
        } catch (err) {
          throw new ApolloError(err.message);
        }
      },
    });
    t.boolean("deleteBeachBarImgUrl", {
      description: "Delete an image (URL) from a #beach_bar",
      args: { id: idArg() },
      resolve: async (_, { id }, { prisma, payload }) => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to delete an image from a #beach_bar", [
          "beach_bar@crud:beach_bar",
          "beach_bar@crud:beach_bar_img_url",
        ]);

        const imgUrl = await prisma.beachBarImgUrl.findUnique({ where: { id: BigInt(id) } });
        if (!imgUrl) throw new ApolloError("Image was not found", errors.NOT_FOUND);

        try {
          // TODO: Fix
          // await imgUrl.softRemove();
        } catch (err) {
          throw new ApolloError(err.message);
        }

        return true;
      },
    });
  },
});
