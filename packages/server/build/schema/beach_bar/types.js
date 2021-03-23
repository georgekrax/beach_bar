"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeachBarAvailabilityType = exports.UpdateBeachBarType = exports.AddBeachBarType = exports.BeachBarResult = exports.BeachBarType = void 0;
const graphql_1 = require("@the_hashtag/common/dist/graphql");
const nexus_1 = require("nexus");
const countryTypes_1 = require("../details/countryTypes");
const types_1 = require("../details/time/types");
const types_2 = require("../details/types");
const types_3 = require("../owner/types");
const types_4 = require("../payment/types");
const types_5 = require("./img_url/types");
const types_6 = require("./location/types");
const types_7 = require("./restaurant/types");
const types_8 = require("./review/types");
const types_9 = require("./service/types");
const types_10 = require("./style/types");
exports.BeachBarType = nexus_1.objectType({
    name: "BeachBar",
    description: "Represents a #beach_bar",
    definition(t) {
        t.id("id", { description: "The ID value of the #beach_bar" });
        t.string("name", { description: "The name of the #beach_bar" });
        t.string("slug", { description: 'The "slugified" name of the #beach_bar, in a URL friendly way' });
        t.nullable.string("description", { description: "A description text about the #beach_bar" });
        t.float("avgRating", {
            description: "The average rating of all the user reviews for this #beach_bar",
            resolve: o => o.avgRating || 0,
        });
        t.nullable.field("thumbnailUrl", {
            type: graphql_1.UrlScalar,
        });
        t.string("contactPhoneNumber", { description: "A phone number to contact the #beach_bar directly" });
        t.boolean("hidePhoneNumber", {
            description: "A boolean that indicates if to NOT display the #beach_bar contact phone number",
        });
        t.boolean("isActive", {
            description: "A boolean that indicates if the #beach_bar is active or not",
        });
        t.boolean("isAvailable", {
            description: "A boolean that indicates if the #beach_bar is shown in the search results, even if it has no availability",
        });
        t.field("location", {
            type: types_6.BeachBarLocationType,
            description: "The location of the #beach_bar",
            resolve: o => o.location,
        });
        t.string("formattedLocation", {
            description: "Get the location of the #beach_bar in a formatted string",
            resolve: (o) => {
                if (!o.location)
                    return "";
                const location = o.location;
                let formattedLocation = "";
                if (location.country)
                    formattedLocation = location.country.alpha2Code + formattedLocation;
                if (location.city)
                    formattedLocation = location.city.name + ", " + formattedLocation;
                if (location.region)
                    formattedLocation = location.region.name + ", " + formattedLocation;
                return formattedLocation;
            },
        });
        t.list.field("payments", {
            type: types_4.PaymentType,
            description: "A list with all the payments of a #beach_bar",
            resolve: (o) => __awaiter(this, void 0, void 0, function* () { return yield o.getPayments(); }),
        });
        t.field("category", {
            type: types_2.BeachBarCategoryType,
            description: "The category (type) of the #beach_bar",
            resolve: o => o.category,
        });
        t.nullable.list.field("imgUrls", {
            type: types_5.BeachBarImgUrlType,
            description: "A list with all the #beach_bar's images (URL values)",
            resolve: o => o.imgUrls,
        });
        t.nullable.list.field("reviews", {
            type: types_8.BeachBarReviewType,
            description: "A list of all the reviews of the #beach_bar",
            resolve: o => o.reviews,
        });
        t.list.nullable.field("features", {
            type: types_9.BeachBarFeatureType,
            description: "A list of all the #beach_bar's features",
            resolve: o => o.features,
        });
        t.nullable.list.field("styles", {
            type: types_10.BeachBarStyleType,
            description: "A list of all the styles the #beach_bar is associated with",
            resolve: o => o.styles,
        });
        t.nullable.list.field("restaurants", {
            type: types_7.BeachBarRestaurantType,
            description: "A list of all the restaurants of a #beach_bar",
            resolve: o => o.restaurants,
        });
        t.field("defaultCurrency", {
            type: countryTypes_1.CurrencyType,
            description: "The default currency of the #beach_bar",
            resolve: o => o.defaultCurrency,
        });
        t.list.field("owners", {
            type: types_3.BeachBarOwnerType,
            description: "A list of all the owners of the #beach_bar",
            resolve: o => o.owners,
        });
        t.field("openingTime", {
            type: types_1.QuarterTimeType,
            description: "The opening quarter time of the #beach_bar, in the time zone of its country",
            resolve: o => o.openingTime,
        });
        t.field("closingTime", {
            type: types_1.QuarterTimeType,
            description: "The closing quarter time of the #beach_bar, in the time zone of its country",
            resolve: o => o.closingTime,
        });
        t.field("updatedAt", {
            type: graphql_1.DateTimeScalar,
            description: "The last time the #beach_bar was updated, in the format of a timestamp",
        });
        t.field("timestamp", {
            type: graphql_1.DateTimeScalar,
            description: "The timestamp recorded, when the #beach_bar was created",
        });
    },
});
exports.BeachBarResult = nexus_1.unionType({
    name: "BeachBarResult",
    definition(t) {
        t.members("BeachBar", "Error");
    },
    resolveType: item => {
        if (item.error) {
            return "Error";
        }
        else {
            return "BeachBar";
        }
    },
});
exports.AddBeachBarType = nexus_1.objectType({
    name: "AddBeachBar",
    description: "Info to be returned when a #beach_bar is added (registered) to the platform",
    definition(t) {
        t.field("beachBar", {
            type: exports.BeachBarType,
            description: "The #beach_bar that is added",
            resolve: o => o.beachBar,
        });
        t.boolean("added", {
            description: "A boolean that indicates if the #beach_bar has been successfully being registered",
        });
    },
});
exports.UpdateBeachBarType = nexus_1.objectType({
    name: "UpdateBeachBar",
    description: "Info to be returned when the details of #beach_bar are updated",
    definition(t) {
        t.field("beachBar", {
            type: exports.BeachBarType,
            description: "The #beach_bar that is updated",
            resolve: o => o.beachBar,
        });
        t.boolean("updated", {
            description: "A boolean that indicates if the #beach_bar details have been successfully updated",
        });
    },
});
exports.BeachBarAvailabilityType = nexus_1.objectType({
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
