import { DateTimeScalar, UrlScalar } from "@the_hashtag/common/dist/graphql";
import { objectType, unionType } from "nexus";
import { fetchBeachBarPayments } from "utils/beach_bar/payment";
import { CurrencyType } from "../details/countryTypes";
import { QuarterTimeType } from "../details/time/types";
import { BeachBarCategoryType } from "../details/types";
import { BeachBarOwnerType } from "../owner/types";
import { PaymentType } from "../payment/types";
import { BeachBarImgUrlType } from "./img_url/types";
import { BeachBarLocationType } from "./location/types";
import { ProductType } from "./product/types";
import { BeachBarRestaurantType } from "./restaurant/types";
import { BeachBarReviewType } from "./review/types";
import { BeachBarFeatureType } from "./service/types";
import { BeachBarStyleType } from "./style/types";

export const BeachBarType = objectType({
  name: "BeachBar",
  description: "Represents a #beach_bar",
  definition(t) {
    t.id("id", { description: "The ID value of the #beach_bar" });
    t.string("name", { description: "The name of the #beach_bar" });
    t.string("slug", { description: 'The "slugified" name of the #beach_bar, in a URL friendly way' });
    t.nullable.string("description", { description: "A description text about the #beach_bar" });
    t.nullable.float("entryFee", { description: "The entry fee this #beach_bar has applied for guests" });
    t.float("avgRating", {
      description: "The average rating of all the user reviews for this #beach_bar",
      resolve: o => o.avgRating || 0,
    });
    t.field("thumbnailUrl", { type: UrlScalar });
    t.string("contactPhoneNumber", { description: "A phone number to contact the #beach_bar directly" });
    t.boolean("hidePhoneNumber", { description: "A boolean that indicates if to NOT display the #beach_bar contact phone number" });
    t.boolean("isActive", { description: "A boolean that indicates if the #beach_bar is active or not" });
    t.boolean("isAvailable", {
      description: "A boolean that indicates if the #beach_bar is shown in the search results, even if it has no availability",
    });
    t.field("location", { type: BeachBarLocationType, description: "The location of the #beach_bar" });
    t.string("formattedLocation", {
      description: "Get the location of the #beach_bar formatted",
      resolve: (o): string => {
        if (!o.location) return "";
        const location = o.location;
        let formattedLocation: string[] = [];
        if (location.region) formattedLocation = [...formattedLocation, location.region.name];
        if (location.city) formattedLocation = [...formattedLocation, location.city.name];
        if (location.country) formattedLocation = [...formattedLocation, location.country.alpha2Code];
        return formattedLocation.join(", ");
      },
    });
    t.list.field("payments", {
      type: PaymentType,
      description: "A list with all the payments of a #beach_bar",
      resolve: async o => {
        const res = await fetchBeachBarPayments(o.id);
        return res;
      },
    });
    t.field("category", { type: BeachBarCategoryType, description: "The category (type) of the #beach_bar" });
    t.list.field("imgUrls", { type: BeachBarImgUrlType, description: "A list with all the #beach_bar's images (URL values)" });
    t.list.field("products", { type: ProductType, description: "A list with all the #beach_bar's products" });
    t.list.field("reviews", { type: BeachBarReviewType, description: "A list of all the reviews of the #beach_bar" });
    t.list.field("features", { type: BeachBarFeatureType, description: "A list of all the #beach_bar's features" });
    t.nullable.list.field("styles", {
      type: BeachBarStyleType,
      description: "A list of all the styles the #beach_bar is associated with",
      resolve: o => o.styles?.map(({ style }) => style),
    });
    t.nullable.list.field("restaurants", {
      type: BeachBarRestaurantType,
      description: "A list of all the restaurants of a #beach_bar",
    });
    t.field("defaultCurrency", { type: CurrencyType, description: "The default currency of the #beach_bar" });
    t.list.field("owners", { type: BeachBarOwnerType, description: "A list of all the owners of the #beach_bar" });
    t.field("openingTime", {
      type: QuarterTimeType,
      description: "The opening quarter time of the #beach_bar, in the time zone of its country",
    });
    t.field("closingTime", {
      type: QuarterTimeType,
      description: "The closing quarter time of the #beach_bar, in the time zone of its country",
    });
    t.field("updatedAt", {
      type: DateTimeScalar,
      description: "The last time the #beach_bar was updated, in the format of a timestamp",
    });
    t.field("timestamp", {
      type: DateTimeScalar,
      description: "The timestamp recorded, when the #beach_bar was created",
    });
  },
});

export const BeachBarResult = unionType({
  name: "BeachBarResult",
  definition(t) {
    t.members("BeachBar", "Error");
  },
  resolveType: item => {
    if (item.error) return "Error";
    else return "BeachBar";
  },
});

export const AddBeachBarType = objectType({
  name: "AddBeachBar",
  description: "Info to be returned when a #beach_bar is added (registered) to the platform",
  definition(t) {
    t.field("beachBar", { type: BeachBarType, description: "The #beach_bar that is added" });
    t.boolean("added", {
      description: "A boolean that indicates if the #beach_bar has been successfully being registered",
    });
  },
});

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

export const UpdateBeachBarType = objectType({
  name: "UpdateBeachBar",
  description: "Info to be returned when the details of #beach_bar are updated",
  definition(t) {
    t.field("beachBar", { type: BeachBarType, description: "The #beach_bar that is updated" });
    t.boolean("updated", {
      description: "A boolean that indicates if the #beach_bar details have been successfully updated",
    });
  },
});

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

export const BeachBarAvailabilityType = objectType({
  name: "BeachBarAvailability",
  description: "Boolean values to show if the #beach_bar is available",
  definition(t) {
    t.nullable.boolean("hasAvailability", {
      description: "A boolean that indicates if the #beach_bar has availability for the dates selected",
    });
    t.nullable.boolean("hasCapacity", {
      description: "A boolean that indicates if the #beach_bar has availability for the people selected",
    });
  },
});
