import { errors, MyContext } from "@beach_bar/common";
import { UrlScalar } from "@the_hashtag/common/dist/graphql";
import { ApolloError } from "apollo-server-express";
import { BeachBar } from "entity/BeachBar";
import { BeachBarImgUrl } from "entity/BeachBarImgUrl";
import { arg, extendType, idArg, nullable, stringArg } from "nexus";
import { DeleteGraphQlType } from "schema/types";
import { TDelete } from "typings/.index";
import { TAddBeachBarImgUrl, TUpdateBeachBarImgUrl } from "typings/beach_bar/img_url";
import { isAuth, throwScopesUnauthorized } from "utils/auth/payload";
import { AddBeachBarImgUrlType, UpdateBeachBarImgUrlType } from "./types";

export const BeachBarImgUrlCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addBeachBarImgUrl", {
      type: AddBeachBarImgUrlType,
      description: "Add an image (URL) to a #beach_bar",
      args: {
        beachBarId: idArg(),
        imgUrl: arg({ type: UrlScalar, description: "The URL value of the image" }),
        description: nullable(
          stringArg({
            description:
              "A short description about what the image represents. The characters of the description should not exceed the number 175",
          })
        ),
      },
      resolve: async (_, { beachBarId, imgUrl, description }, { payload }: MyContext): Promise<TAddBeachBarImgUrl> => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to add an image to a #beach_bar", [
          "beach_bar@crud:beach_bar",
          "beach_bar@crud:beach_bar_img_url",
        ]);

        const beachBar = await BeachBar.findOne(beachBarId);
        if (!beachBar) throw new ApolloError(errors.BEACH_BAR_DOES_NOT_EXIST, errors.NOT_FOUND);

        const newImgUrl = BeachBarImgUrl.create({ beachBar, imgUrl: imgUrl.toString(), description });

        try {
          await newImgUrl.save();
        } catch (err) {
          throw new ApolloError(err.message);
        }

        return { imgUrl: newImgUrl, added: true };
      },
    });
    t.field("updateBeachBaImgUrl", {
      type: UpdateBeachBarImgUrlType,
      description: "Update the details of a #beach_bar's image",
      args: { imgUrlId: idArg(), imgUrl: nullable(arg({ type: UrlScalar })), description: nullable(stringArg()) },
      resolve: async (_, { imgUrlId, imgUrl, description }, { payload }: MyContext): Promise<TUpdateBeachBarImgUrl> => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to update an image of a #beach_bar", [
          "beach_bar@crud:beach_bar",
          "beach_bar@crud:beach_bar_img_url",
          "beach_bar@update:beach_bar_img_url",
        ]);

        const beachBarImgUrl = await BeachBarImgUrl.findOne({ where: { id: imgUrlId }, relations: ["beachBar"] });
        if (!beachBarImgUrl) throw new ApolloError("Image was not found", errors.NOT_FOUND);

        try {
          const updatedImgUrl = await beachBarImgUrl.update(imgUrl, description);

          return { imgUrl: updatedImgUrl, updated: true };
        } catch (err) {
          throw new ApolloError(err.message);
        }
      },
    });
    t.field("deleteBeachBarImgUrl", {
      type: DeleteGraphQlType,
      description: "Delete an image (URL) from a #beach_bar",
      args: { imgUrlId: idArg() },
      resolve: async (_, { imgUrlId }, { payload }: MyContext): Promise<TDelete> => {
        isAuth(payload);
        throwScopesUnauthorized(payload, "You are not allowed to delete an image from a #beach_bar", [
          "beach_bar@crud:beach_bar",
          "beach_bar@crud:beach_bar_img_url",
        ]);

        const imgUrl = await BeachBarImgUrl.findOne({ where: { id: imgUrlId }, relations: ["beachBar"] });
        if (!imgUrl) throw new ApolloError("Image was not found", errors.NOT_FOUND);

        try {
          await imgUrl.softRemove();
        } catch (err) {
          throw new ApolloError(err.message);
        }

        return { deleted: true };
      },
    });
  },
});
