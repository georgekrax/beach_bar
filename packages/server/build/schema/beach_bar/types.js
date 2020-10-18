"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeachBarAvailabilityType = exports.UpdateBeachBarResult = exports.UpdateBeachBarType = exports.AddBeachBarResult = exports.AddBeachBarType = exports.BeachBarResult = exports.BeachBarType = void 0;
const common_1 = require("@georgekrax-hashtag/common");
const schema_1 = require("@nexus/schema");
const countryTypes_1 = require("../details/countryTypes");
const types_1 = require("../details/time/types");
const types_2 = require("../details/types");
const types_3 = require("../owner/types");
const types_4 = require("./img_url/types");
const types_5 = require("./location/types");
const types_6 = require("./restaurant/types");
const types_7 = require("./review/types");
const types_8 = require("./service/types");
const types_9 = require("./style/types");
exports.BeachBarType = schema_1.objectType({
    name: "BeachBar",
    description: "Represents a #beach_bar",
    definition(t) {
        t.int("id", { nullable: false, description: "The ID value of the #beach_bar" });
        t.string("name", { nullable: false, description: "The name of the #beach_bar" });
        t.string("description", { nullable: true, description: "A description text about the #beach_bar" });
        t.float("avgRating", { nullable: true, description: "The average rating of all the user reviews for this #beach_bar" });
        t.field("thumbnailUrl", {
            type: common_1.UrlScalar,
            nullable: true,
        });
        t.string("contactPhoneNumber", { nullable: false, description: "A phone number to contact the #beach_bar directly" });
        t.boolean("hidePhoneNumber", {
            nullable: false,
            description: "A boolean that indicates if to NOT display the #beach_bar contact phone number",
        });
        t.boolean("isActive", {
            nullable: false,
            description: "A boolean that indicates if the #beach_bar is active or not",
        });
        t.boolean("isAvailable", {
            nullable: false,
            description: "A boolean that indicates if the #beach_bar is shown in the search results, even if it has no availability",
        });
        t.field("location", {
            type: types_5.BeachBarLocationType,
            description: "The location of the #beach_bar",
            nullable: false,
            resolve: o => o.location,
        });
        t.field("category", {
            type: types_2.BeachBarCategoryType,
            description: "The category (type) of the #beach_bar",
            nullable: false,
            resolve: o => o.category,
        });
        t.list.field("imgUrls", {
            type: types_4.BeachBarImgUrlType,
            description: "A list with all the #beach_bar's images (URL values)",
            nullable: true,
            resolve: o => o.imgUrls,
        });
        t.list.field("reviews", {
            type: types_7.BeachBarReviewType,
            description: "A list of all the reviews of the #beach_bar",
            nullable: true,
            resolve: o => o.reviews,
        });
        t.list.field("features", {
            type: types_8.BeachBarFeatureType,
            description: "A list of all the #beach_bar's features",
            nullable: true,
            resolve: o => o.features,
        });
        t.list.field("styles", {
            type: types_9.BeachBarStyleType,
            description: "A list of all the styles the #beach_bar is associated with",
            nullable: true,
            resolve: o => o.styles,
        });
        t.list.field("restaurants", {
            type: types_6.BeachBarRestaurantType,
            description: "A list of all the restaurants of a #beach_bar",
            nullable: true,
            resolve: o => o.restaurants,
        });
        t.field("defaultCurrency", {
            type: countryTypes_1.CurrencyType,
            description: "The default currency of the #beach_bar",
            nullable: false,
            resolve: o => o.defaultCurrency,
        });
        t.list.field("owners", {
            type: types_3.BeachBarOwnerType,
            description: "A list of all the owners of the #beach_bar",
            nullable: false,
            resolve: o => o.owners,
        });
        t.field("openingTime", {
            type: types_1.QuarterTimeType,
            description: "The opening quarter time of the #beach_bar, in the time zone of its country",
            nullable: false,
            resolve: o => o.openingTime,
        });
        t.field("closingTime", {
            type: types_1.QuarterTimeType,
            description: "The closing quarter time of the #beach_bar, in the time zone of its country",
            nullable: false,
            resolve: o => o.closingTime,
        });
        t.field("updatedAt", {
            type: common_1.DateTimeScalar,
            nullable: false,
            description: "The last time the #beach_bar was updated, in the format of a timestamp",
        });
        t.field("timestamp", {
            type: common_1.DateTimeScalar,
            nullable: false,
            description: "The timestamp recorded, when the #beach_bar was created",
        });
    },
});
exports.BeachBarResult = schema_1.unionType({
    name: "BeachBarResult",
    definition(t) {
        t.members("BeachBar", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else {
                return "BeachBar";
            }
        });
    },
});
exports.AddBeachBarType = schema_1.objectType({
    name: "AddBeachBar",
    description: "Info to be returned when a #beach_bar is added (registered) to the platform",
    definition(t) {
        t.field("beachBar", {
            type: exports.BeachBarType,
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
exports.AddBeachBarResult = schema_1.unionType({
    name: "AddBeachBarResult",
    definition(t) {
        t.members("AddBeachBar", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else {
                return "AddBeachBar";
            }
        });
    },
});
exports.UpdateBeachBarType = schema_1.objectType({
    name: "UpdateBeachBar",
    description: "Info to be returned when the details of #beach_bar are updated",
    definition(t) {
        t.field("beachBar", {
            type: exports.BeachBarType,
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
exports.UpdateBeachBarResult = schema_1.unionType({
    name: "UpdateBeachBarResult",
    definition(t) {
        t.members("UpdateBeachBar", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else {
                return "UpdateBeachBar";
            }
        });
    },
});
exports.BeachBarAvailabilityType = schema_1.objectType({
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
//# sourceMappingURL=types.js.map