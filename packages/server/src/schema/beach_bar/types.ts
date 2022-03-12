import { fetchBarPayments } from "@/utils/beachBar";
import { resolve } from "@/utils/data";
import { nonNull, objectType } from "nexus";
import { BeachBar } from "nexus-prisma";
import { PaymentType } from "../payment/types";

export const BeachBarType = objectType({
  name: BeachBar.$name,
  description: "Represents a #beach_bar",
  definition(t) {
    // t.id("id", { description: "The ID value of the #beach_bar" });
    // t.string("name", { description: "The name of the #beach_bar" });
    // t.string("slug", { description: 'The "slugified" name of the #beach_bar, in a URL friendly way' });
    // t.string("description", { description: "A description text about the #beach_bar" });
    // t.nullable.float("entryFee", { description: "The entry fee this #beach_bar has applied for guests" });
    // t.float("avgRating", {
    //   description: "The average rating of all the user reviews for this #beach_bar",
    //   resolve: o => o.avgRating || 0,
    // });
    // t.field("thumbnailUrl", { type: UrlScalar });
    // t.string("contactPhoneNumber", { description: "A phone number to contact the #beach_bar directly" });
    // t.boolean("hidePhoneNumber", { description: "A boolean that indicates if to NOT display the #beach_bar contact phone number" });
    // t.boolean("zeroCartTotal", { description: "Allow customer's shopping carts to have total = 0.00 €" });
    // t.boolean("hasCompletedSignUp", { description: "Has completed - finished the sign up process (form)" });
    // t.boolean("isActive", { description: "A boolean that indicates if the #beach_bar is active or not" });
    // t.boolean("displayRegardlessCapacity", {
    //   description: "A boolean that indicates if the #beach_bar is shown in the search results, even if it has no availability",
    // });
    // t.field("location", { type: BeachBarLocationType, description: "The location of the #beach_bar" });
    // t.field("category", { type: BeachBarCategoryType, description: "The category (type) of the #beach_bar" });
    // t.list.field("imgUrls", { type: BeachBarImgUrlType, description: "A list with all the #beach_bar's images (URL values)" });
    // t.list.field("products", { type: ProductType, description: "A list with all the #beach_bar's products" });
    // t.list.field("foods", { type: FoodType, description: "A list with all the #beach_bar's foods and beverages" });
    // t.list.field("reviews", { type: BeachBarReviewType, description: "A list of all the reviews of the #beach_bar" });
    // t.list.field("features", { type: BeachBarFeatureType, description: "A list of all the #beach_bar's features" });
    // t.nullable.list.field("restaurants", {
    //   type: BeachBarRestaurantType,
    //   description: "A list of all the restaurants of a #beach_bar",
    // });
    // t.field("defaultCurrency", { type: CurrencyType, description: "The default currency of the #beach_bar" });
    // t.list.field("owners", { type: BeachBarOwnerType, description: "A list of all the owners of the #beach_bar" });
    // t.field("openingTime", {
    //   type: HourTimeType,
    //   description: "The opening quarter time of the #beach_bar, in the time zone of its country",
    // });
    // t.field("closingTime", {
    //   type: HourTimeType,
    //   description: "The closing quarter time of the #beach_bar, in the time zone of its country",
    // });
    // t.field("updatedAt", {
    //   type: DateTime.name,
    //   description: "The last time the #beach_bar was updated, in the format of a timestamp",
    // });
    // t.field("timestamp", {
    //   type: DateTime.name,
    //   description: "The timestamp recorded, when the #beach_bar was created",
    // });
    t.field(BeachBar.id);
    t.field(BeachBar.name);
    t.field(BeachBar.slug);
    t.field(BeachBar.description);
    t.field(BeachBar.entryFee);
    // @ts-expect-error
    t.field({ ...BeachBar.avgRating, type: "Float", resolve: o => o.avgRating || 0 });
    t.field(BeachBar.thumbnailUrl);
    t.field(BeachBar.contactPhoneNumber);
    t.field(BeachBar.hidePhoneNumber);
    t.field(BeachBar.zeroCartTotal);
    t.field(BeachBar.hasCompletedSignUp);
    t.field(BeachBar.isActive);
    t.field(BeachBar.displayRegardlessCapacity);
    // t.field(resolve(BeachBar.location));
    t.field(resolve(BeachBar.category));
    t.field(resolve(BeachBar.imgUrls));
    t.field(resolve(BeachBar.products));
    t.field(resolve(BeachBar.foods));
    t.field(resolve(BeachBar.reviews));
    t.field(resolve(BeachBar.features));
    t.field(resolve(BeachBar.restaurants));
    t.field(resolve(BeachBar.currency));
    t.field(resolve(BeachBar.owners));
    t.field(resolve(BeachBar.openingTime));
    t.field(resolve(BeachBar.closingTime));
    t.field(resolve(BeachBar.styles));
    t.field(BeachBar.timestamp);
    t.field(BeachBar.updatedAt);
    // t.nullable.list.field("styles", {
    //   type: BeachBarStyleType,
    //   description: "A list of all the styles the #beach_bar is associated with",
    //   resolve: o => o["styles"]?.map(({ style }) => style) || [],
    // });
    t.list.field("payments", {
      type: PaymentType,
      description: "A list with all the payments of a #beach_bar",
      resolve: async ({ id }) => await fetchBarPayments({ beachBarId: id }),
    });
    t.field({
      // resolve({
      ...BeachBar.location,
      type: nonNull(BeachBar.location.type as any),
      resolve: async (...args) => {
        const [parent, _, { prisma }, { operation }] = args;
        const hasFormatted = operation.loc?.source.body.includes("formattedLocation");
        if (!hasFormatted) return await BeachBar.location.resolve(...args);
        else {
          return (await prisma.beachBarLocation.findUnique({
            where: { beachBarId: +parent.id },
            include: { region: true, city: true, country: true },
          })) as any;
        }
      },
      // })
    });
  },
});

// export const BeachBarResult = unionType({
//   name: "BeachBarResult",
//   definition(t) {
//     t.members("BeachBar", "Error");
//   },
//   resolveType: item => (item["error"] ? "Error" : "BeachBar"),
// });

// export const AddBeachBarType = objectType({
//   name: "AddBeachBar",
//   description: "Info to be returned when a #beach_bar is added (registered) to the platform",
//   definition(t) {
//     t.field("beachBar", { type: BeachBarType, description: "The #beach_bar that is added" });
//     t.boolean("added", {
//       description: "A boolean that indicates if the #beach_bar has been successfully being registered",
//     });
//   },
// });

// export const AddBeachBarResult = unionType({
//   name: "AddBeachBarResult",
//   definition(t) {
//     t.members("AddBeachBar", "Error");
//   },
//   resolveType: item => {
//     if (item.error) {
//       return "Error";
//     } else {
//       return "AddBeachBar";
//     }
//   },
// });

// export const UpdateBeachBarType = objectType({
//   name: "UpdateBeachBar",
//   description: "Info to be returned when the details of #beach_bar are updated",
//   definition(t) {
//     t.field("beachBar", { type: BeachBarType, description: "The #beach_bar that is updated" });
//     t.boolean("updated", {
//       description: "A boolean that indicates if the #beach_bar details have been successfully updated",
//     });
//   },
// });

// export const OtherHoursAvailailityType = objectType({
//   name: "OtherHoursAvailaility",
//   description: "Info to be returned for the other dates and times available for a #beach_bar, depending on user's search criteria",
//   definition(t) {
//     t.list.field("otherTimesInDate", { type: HourTimeType, description: "Other hour(s) this #beach_bar has availability" });
//     t.list.field("otherDates", { type: DateScalar, description: "Other date(s) this #beach_bar has availability" });
//   },
// });

// export const UpdateBeachBarResult = unionType({
//   name: "UpdateBeachBarResult",
//   definition(t) {
//     t.members("UpdateBeachBar", "Error");
//   },
//   resolveType: item => {
//     if (item.error) {
//       return "Error";
//     } else {
//       return "UpdateBeachBar";
//     }
//   },
// });

// export const BeachBarAvailabilityType = objectType({
//   name: "BeachBarAvailability",
//   description: "Boolean values to show if the #beach_bar is available",
//   definition(t) {
//     t.boolean("isOpen", {
//       description:
//         "A boolean that indicates if the #beach_bar is open and active, even if it does not have capacity for the selected date, time and people",
//     });
//     t.boolean("hasCapacity", {
//       description: "A boolean that indicates if the #beach_bar has availability for the people selected",
//     });
//   },
// });
