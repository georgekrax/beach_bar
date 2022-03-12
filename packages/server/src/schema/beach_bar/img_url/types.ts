import { resolve } from "@/utils/data";
import { objectType } from "nexus";
import { BeachBarImgUrl } from "nexus-prisma";

export const BeachBarImgUrlType = objectType({
  name: BeachBarImgUrl.$name,
  description: "Represents a #beach_bar's image (URL value)",
  definition(t) {
    // t.id("id");
    // t.field("imgUrl", { type: UrlScalar });
    // t.nullable.string("description", {
    //   description:
    //     "A short description about what the image represents. The characters of the description should not exceed the number 175",
    // });
    // t.field("beachBar", { type: BeachBarType });
    // t.field("updatedAt", { type: DateTime.name });
    // t.field("timestamp", { type: DateTime.name });
    t.field(BeachBarImgUrl.id);
    t.field(BeachBarImgUrl.imgUrl);
    t.field(BeachBarImgUrl.description);
    t.field(resolve(BeachBarImgUrl.beachBar));
    t.field(BeachBarImgUrl.timestamp);
    t.field(BeachBarImgUrl.updatedAt);
  },
});

// export const AddBeachBarImgUrlType = objectType({
//   name: "AddBeachBarImgUrl",
//   description: "Info to be returned when an image (URL) is added to a #beach_bar",
//   definition(t) {
//     t.field("imgUrl", { type: BeachBarImgUrlType, description: "The image that is added" });
//     t.boolean("added", { description: "Indicates if the image (URL) has been successfully been added to the #beach_bar" });
//   },
// });

// export const AddBeachBarImgUrlResult = unionType({
//   name: "AddBeachBarImgUrlResult",
//   definition(t) {
//     t.members("AddBeachBarImgUrl", "Error");
//   },
//   resolveType: item => {
//     if (item.error) return "Error";
//     else return "AddBeachBarImgUrl";
//   },
// });

// export const UpdateBeachBarImgUrlType = objectType({
//   name: "UpdateBeachBarImgUrl",
//   description: "Info to be returned when the details of #beach_bar's image, are updated",
//   definition(t) {
//     t.field("imgUrl", { type: BeachBarImgUrlType, description: "The image that is updated" });
//     t.boolean("updated", { description: "Indicates if the image details have been successfully updated" });
//   },
// });

// export const UpdateBeachBarImgUrlResult = unionType({
//   name: "UpdateBeachBarImgUrlResult",
//   definition(t) {
//     t.members("UpdateBeachBarImgUrl", "Error");
//   },
//   resolveType: item => {
//     if (item.error) return "Error";
//     else return "UpdateBeachBarImgUrl";
//   },
// });
