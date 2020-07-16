import { DateTimeScalar, UrlScalar } from "@beach_bar/common";
import { objectType, unionType } from "@nexus/schema";
import { CurrencyType } from "../details/countryTypes";
import { QuarterTimeType } from "../details/time/types";
import { BeachBarOwnerType } from "../owner/types";
import { BeachBarLocationType } from "./location/types";
import { BeachBarRestaurantType } from "./restaurant/types";
import { BeachBarReviewType } from "./review/types";
import { BeachBarFeatureType } from "./service/types";

export const BeachBarType = objectType({
  name: "BeachBar",
  description: "Represents a #beach_bar",
  definition(t) {
    t.int("id", { nullable: false, description: "The ID value of the #beach_bar" });
    t.string("name", { nullable: false, description: "The name of the #beach_bar" });
    t.string("description", { nullable: true, description: "A description text about the #beach_bar" });
    t.float("avgRating", { nullable: true, description: "The average rating of all the user reviews for this #beach_bar" });
    t.boolean("isActive", {
      nullable: false,
      description: "A boolean that indicates if the #beach_bar is active or not",
    });
    t.boolean("isAvailable", {
      nullable: false,
      description: "A boolean that indicates if the #beach_bar is shown in the search results, even if it has no availability",
    });
    t.field("thumbnailUrl", {
      type: UrlScalar,
      nullable: true,
    });
    t.field("updatedAt", {
      type: DateTimeScalar,
      nullable: false,
      description: "The last time the #beach_bar was updated, in the format of a timestamp",
    });
    t.field("timestamp", {
      type: DateTimeScalar,
      nullable: false,
      description: "The timestamp recorded, when the #beach_bar was created",
    });
    t.field("location", {
      type: BeachBarLocationType,
      description: "The location of the #beach_bar",
      nullable: false,
      resolve: o => o.location,
    });
    t.list.field("owners", {
      type: BeachBarOwnerType,
      description: "A list of all the owners of the #beach_bar",
      nullable: false,
      resolve: o => o.owners,
    });
    t.list.field("reviews", {
      type: BeachBarReviewType,
      description: "A list of all the reviews of the #beach_bar",
      nullable: true,
      resolve: o => o.reviews,
    });
    t.list.field("features", {
      type: BeachBarFeatureType,
      description: "A list of all the #beach_bar's features",
      nullable: true,
      resolve: o => o.features,
    });
    t.list.field("restaurants", {
      type: BeachBarRestaurantType,
      description: "A list of all the restaurants of a #beach_bar",
      nullable: true,
      resolve: o => o.restaurants,
    });
    t.field("defaultCurrency", {
      type: CurrencyType,
      description: "The default currency of the #beach_bar",
      nullable: false,
      resolve: o => o.defaultCurrency,
    });
    t.field("openingTime", {
      type: QuarterTimeType,
      description: "The opening quarter time of the #beach_bar, in the time zone of its country",
      nullable: false,
      resolve: o => o.openingTime,
    });
    t.field("closingTime", {
      type: QuarterTimeType,
      description: "The closing quarter time of the #beach_bar, in the time zone of its country",
      nullable: false,
      resolve: o => o.closingTime,
    });
  },
});

export const BeachBarResult = unionType({
  name: "BeachBarResult",
  definition(t) {
    t.members("BeachBar", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "BeachBar";
      }
    });
  },
});

export const AddBeachBarType = objectType({
  name: "AddBeachBar",
  description: "Info to be returned when a #beach_bar is added (registered) to the platform",
  definition(t) {
    t.field("beachBar", {
      type: BeachBarType,
      description: "The #beach_bar that is added",
      nullable: false,
      resolve: o => o.beachBar,
    });
    t.boolean("added", {
      nullable: false,
      description: "A boolean that indicates if the #beach_bar has been successfully being registered",
    });
  },
});

export const AddBeachBarResult = unionType({
  name: "AddBeachBarResult",
  definition(t) {
    t.members("AddBeachBar", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "AddBeachBar";
      }
    });
  },
});

export const UpdateBeachBarType = objectType({
  name: "UpdateBeachBar",
  description: "Info to be returned when the details of #beach_bar are updated",
  definition(t) {
    t.field("beachBar", {
      type: BeachBarType,
      description: "The #beach_bar that is updated",
      nullable: false,
      resolve: o => o.beachBar,
    });
    t.boolean("updated", {
      nullable: false,
      description: "A boolean that indicates if the #beach_bar details have been successfully updated",
    });
  },
});

export const UpdateBeachBarResult = unionType({
  name: "UpdateBeachBarResult",
  definition(t) {
    t.members("UpdateBeachBar", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "UpdateBeachBar";
      }
    });
  },
});

export const BeachBarAvailabilityType = objectType({
  name: "BeachBarAvailability",
  description: "Boolean values to show if the #beach_bar is available",
  definition(t) {
    t.boolean("hasAvailability", {
      nullable: true,
      description: "A boolean that indicates if the #beach_bar has availability for the dates selected",
    });
    t.boolean("hasCapacity", {
      nullable: true,
      description: "A boolean that indicates if the #beach_bar has availability for the people selected",
    });
  },
});
