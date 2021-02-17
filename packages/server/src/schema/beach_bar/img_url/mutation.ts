import { errors, MyContext } from "@beach_bar/common";
import { UrlScalar } from "@the_hashtag/common/dist/graphql";
import { BeachBar } from "entity/BeachBar";
import { BeachBarImgUrl } from "entity/BeachBarImgUrl";
import { arg, extendType, idArg, intArg, nullable, stringArg } from "nexus";
import { DeleteResult } from "schema/types";
import { DeleteType } from "typings/.index";
import { AddBeachBarImgUrlType, UpdateBeachBarImgUrlType } from "typings/beach_bar/img_url";
import { checkScopes } from "utils/checkScopes";
import { AddBeachBarImgUrlResult, UpdateBeachBarImgUrlResult } from "./types";

export const BeachBarImgUrlCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addBeachBarImgUrl", {
      type: AddBeachBarImgUrlResult,
      description: "Add an image (URL) to a #beach_bar",
      args: {
        beachBarId: intArg({ description: "The ID value of the #beach_bar" }),
        imgUrl: arg({
          type: UrlScalar,
          description: "The URL value of the image",
        }),
        description: nullable(
          stringArg({
            description:
              "A short description about what the image represents. The characters of the description should not exceed the number 175",
          })
        ),
      },
      resolve: async (_, { beachBarId, imgUrl, description }, { payload }: MyContext): Promise<AddBeachBarImgUrlType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!checkScopes(payload, ["beach_bar@crud:beach_bar", "beach_bar@crud:beach_bar_img_url"])) {
          return { error: { code: errors.UNAUTHORIZED_CODE, message: "You are not allowed to add an image to a #beach_bar" } };
        }
        if (!beachBarId || beachBarId <= 0 || !imgUrl) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: errors.SOMETHING_WENT_WRONG } };
        }

        const beachBar = await BeachBar.findOne(beachBarId);
        if (!beachBar) {
          return { error: { code: errors.CONFLICT, message: errors.BEACH_BAR_DOES_NOT_EXIST } };
        }

        const newImgUrl = BeachBarImgUrl.create({
          beachBar,
          imgUrl: imgUrl.toString(),
          description,
        });

        try {
          await newImgUrl.save();
        } catch (err) {
          return { error: { message: `${errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
        }

        return {
          imgUrl: newImgUrl,
          added: true,
        };
      },
    });
    t.field("updateBeachBaImgUrl", {
      type: UpdateBeachBarImgUrlResult,
      description: "Update the details of a #beach_bar's image",
      args: {
        imgUrlId: idArg({ description: "The ID value of the #beach_bar's image" }),
        imgUrl: nullable(arg({
          type: UrlScalar,
          description: "The URL value of the image",
        })),
        description: nullable(stringArg({
          description:
            "A short description about what the image represents. The characters of the description should not exceed the number 175",
        })),
      },
      resolve: async (_, { imgUrlId, imgUrl, description }, { payload }: MyContext): Promise<UpdateBeachBarImgUrlType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (
          !checkScopes(payload, ["beach_bar@crud:beach_bar", "beach_bar@crud:beach_bar_img_url", "beach_bar@update:beach_bar_img_url"])
        ) {
          return { error: { code: errors.UNAUTHORIZED_CODE, message: "You are not allowed to update an image of a #beach_bar" } };
        }
        if (!imgUrlId || imgUrlId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: errors.SOMETHING_WENT_WRONG } };
        }

        const beachBarImgUrl = await BeachBarImgUrl.findOne({ where: { id: imgUrlId }, relations: ["beachBar"] });
        if (!beachBarImgUrl) {
          return { error: { code: errors.CONFLICT, message: "Specified image does not exist" } };
        }

        try {
          const updatedImgUrl = await beachBarImgUrl.update(imgUrl, description);

          return {
            imgUrl: updatedImgUrl,
            updated: true,
          };
        } catch (err) {
          return { error: { message: `${errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
        }
      },
    });
    t.field("deleteBeachBarImgUrl", {
      type: DeleteResult,
      description: "Delete an image (URL) from a #beach_bar",
      args: {
        imgUrlId: idArg({ description: "The ID value of the #beach_bar's image" }),
      },
      resolve: async (_, { imgUrlId }, { payload }: MyContext): Promise<DeleteType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!checkScopes(payload, ["beach_bar@crud:beach_bar", "beach_bar@crud:beach_bar_img_url"])) {
          return { error: { code: errors.UNAUTHORIZED_CODE, message: "You are not allowed to delete an image from a #beach_bar" } };
        }
        if (!imgUrlId || imgUrlId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: errors.SOMETHING_WENT_WRONG } };
        }

        const imgUrl = await BeachBarImgUrl.findOne({ where: { id: imgUrlId }, relations: ["beachBar"] });
        if (!imgUrl) {
          return { error: { code: errors.CONFLICT, message: "Specified image does not exist" } };
        }

        try {
          await imgUrl.softRemove();
        } catch (err) {
          return { error: { message: `${errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
        }

        return {
          deleted: true,
        };
      },
    });
  },
});
