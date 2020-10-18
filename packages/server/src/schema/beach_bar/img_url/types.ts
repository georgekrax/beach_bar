import { UrlScalar } from "@georgekrax-hashtag/common";
import { objectType, unionType } from "@nexus/schema";
import { BeachBarType } from "../types";

export const BeachBarImgUrlType = objectType({
  name: "BeachBarImgUrl",
  description: "Represents a #beach_bar's image (URL value)",
  definition(t) {
    t.id("id", { nullable: false });
    t.field("imgUrl", { type: UrlScalar, nullable: false });
    t.string("description", {
      nullable: true,
      description:
        "A short description about what the image represents. The characters of the description should not exceed the number 175",
    });
    t.field("beachBar", { type: BeachBarType, nullable: false, resolve: o => o.beachBar });
  },
});

export const AddBeachBarImgUrlType = objectType({
  name: "AddBeachBarImgUrl",
  description: "Info to be returned when an image (URL) is added to a #beach_bar",
  definition(t) {
    t.field("imgUrl", {
      type: BeachBarImgUrlType,
      description: "The image that is added",
      nullable: false,
      resolve: o => o.imgUrl,
    });
    t.boolean("added", {
      nullable: false,
      description: "Indicates if the image (URL) has been successfully been added to the #beach_bar",
    });
  },
});

export const AddBeachBarImgUrlResult = unionType({
  name: "AddBeachBarImgUrlResult",
  definition(t) {
    t.members("AddBeachBarImgUrl", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "AddBeachBarImgUrl";
      }
    });
  },
});

export const UpdateBeachBarImgUrlType = objectType({
  name: "UpdateBeachBarImgUrl",
  description: "Info to be returned when the details of #beach_bar's image, are updated",
  definition(t) {
    t.field("imgUrl", {
      type: BeachBarImgUrlType,
      description: "The image that is updated",
      nullable: false,
      resolve: o => o.imgUrl,
    });
    t.boolean("updated", {
      nullable: false,
      description: "Indicates if the image details have been successfully updated",
    });
  },
});

export const UpdateBeachBarImgUrlResult = unionType({
  name: "UpdateBeachBarImgUrlResult",
  definition(t) {
    t.members("UpdateBeachBarImgUrl", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "UpdateBeachBarImgUrl";
      }
    });
  },
});
