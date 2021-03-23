import { UrlScalar } from "@the_hashtag/common/dist/graphql";
import { objectType, unionType } from "nexus";
import { BeachBarType } from "../types";

export const BeachBarImgUrlType = objectType({
  name: "BeachBarImgUrl",
  description: "Represents a #beach_bar's image (URL value)",
  definition(t) {
    t.id("id");
    t.field("imgUrl", { type: UrlScalar });
    t.nullable.string("description", {
      description:
        "A short description about what the image represents. The characters of the description should not exceed the number 175",
    });
    t.field("beachBar", { type: BeachBarType, resolve: o => o.beachBar });
  },
});

export const AddBeachBarImgUrlType = objectType({
  name: "AddBeachBarImgUrl",
  description: "Info to be returned when an image (URL) is added to a #beach_bar",
  definition(t) {
    t.field("imgUrl", {
      type: BeachBarImgUrlType,
      description: "The image that is added",
      resolve: o => o.imgUrl,
    });
    t.boolean("added", { description: "Indicates if the image (URL) has been successfully been added to the #beach_bar" });
  },
});

export const AddBeachBarImgUrlResult = unionType({
  name: "AddBeachBarImgUrlResult",
  definition(t) {
    t.members("AddBeachBarImgUrl", "Error");
  },
  resolveType: item => {
    if (item.error) {
      return "Error";
    } else {
      return "AddBeachBarImgUrl";
    }
  },
});

export const UpdateBeachBarImgUrlType = objectType({
  name: "UpdateBeachBarImgUrl",
  description: "Info to be returned when the details of #beach_bar's image, are updated",
  definition(t) {
    t.field("imgUrl", {
      type: BeachBarImgUrlType,
      description: "The image that is updated",
      resolve: o => o.imgUrl,
    });
    t.boolean("updated", { description: "Indicates if the image details have been successfully updated" });
  },
});

export const UpdateBeachBarImgUrlResult = unionType({
  name: "UpdateBeachBarImgUrlResult",
  definition(t) {
    t.members("UpdateBeachBarImgUrl", "Error");
  },
  resolveType: item => {
    if (item.error) {
      return "Error";
    } else {
      return "UpdateBeachBarImgUrl";
    }
  },
});
