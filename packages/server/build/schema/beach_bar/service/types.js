"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBeachBarFeatureResult = exports.UpdateBeachBarFeatureType = exports.AddBeachBarFeatureResult = exports.AddBeachBarFeatureType = exports.BeachBarFeatureType = exports.BeachBarServiceType = void 0;
const graphql_1 = require("@the_hashtag/common/dist/graphql");
const nexus_1 = require("nexus");
const types_1 = require("../types");
exports.BeachBarServiceType = nexus_1.objectType({
    name: "BeachBarService",
    description: "Represents a service (feature), which a #beach_bar can provide",
    definition(t) {
        t.id("id", {
            description: "The ID value of the feature",
        });
        t.string("name", { description: "The name of the feature" });
        t.string("iconUrl", { description: "The URL value of the icon image of the feature" });
        t.nullable.string("iconUrl", { description: "The URL value of the icon colored image of the feature, with color" });
    },
});
exports.BeachBarFeatureType = nexus_1.objectType({
    name: "BeachBarFeature",
    description: "Represents a #beach_bar's feature (service) & its details",
    definition(t) {
        t.field("service", {
            type: exports.BeachBarServiceType,
            description: "The feature (service) the #beach_bar provides",
            resolve: o => o.service,
        });
        t.field("beachBar", {
            type: types_1.BeachBarType,
            description: "The #beach_bar that provides the feature (service)",
            resolve: o => o.beachBar,
        });
        t.int("quantity", {
            description: "An integer that indicates the quantity of the service, a #beach_bar provides",
            resolve: o => o.quantity,
        });
        t.nullable.string("description", {
            description: "A short description about the service",
            resolve: o => o.description,
        });
        t.field("updatedAt", { type: graphql_1.DateTimeScalar });
        t.field("timestamp", { type: graphql_1.DateTimeScalar });
    },
});
exports.AddBeachBarFeatureType = nexus_1.objectType({
    name: "AddBeachBarFeature",
    description: "Info to be returned when a feature is added (assigned) to a #beach_bar",
    definition(t) {
        t.field("feature", {
            type: exports.BeachBarFeatureType,
            description: "The feature that will be added (assigned) to the #beach_bar",
            resolve: o => o.feature,
        });
        t.boolean("added", {
            description: "A boolean that indicates if the feature has been successfully added (assigned) to the #beach_bar",
        });
    },
});
exports.AddBeachBarFeatureResult = nexus_1.unionType({
    name: "AddBeachBarFeatureResult",
    definition(t) {
        t.members("AddBeachBarFeature", "Error");
    },
    resolveType: item => {
        if (item.name === "Error") {
            return "Error";
        }
        else {
            return "AddBeachBarFeature";
        }
    },
});
exports.UpdateBeachBarFeatureType = nexus_1.objectType({
    name: "UpdateBeachBarFeature",
    description: "Info to be returned when the info of a feature of a #beach_bar, are updated",
    definition(t) {
        t.field("feature", {
            type: exports.BeachBarFeatureType,
            description: "The feature that will be updated",
            resolve: o => o.feature,
        });
        t.boolean("updated", {
            description: "A boolean that indicates if the feature has been successfully updated",
        });
    },
});
exports.UpdateBeachBarFeatureResult = nexus_1.unionType({
    name: "UpdateBeachBarFeatureResult",
    definition(t) {
        t.members("UpdateBeachBarFeature", "Error");
    },
    resolveType: item => {
        if (item.name === "Error") {
            return "Error";
        }
        else {
            return "UpdateBeachBarFeature";
        }
    },
});
