"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBeachBarFeatureResult = exports.UpdateBeachBarFeatureType = exports.AddBeachBarFeatureResult = exports.AddBeachBarFeatureType = exports.BeachBarFeatureType = exports.BeachBarServiceType = void 0;
const common_1 = require("@georgekrax-hashtag/common");
const schema_1 = require("@nexus/schema");
const types_1 = require("../types");
exports.BeachBarServiceType = schema_1.objectType({
    name: "BeachBarService",
    description: "Represents a service (feature), which a #beach_bar can provide",
    definition(t) {
        t.int("id", {
            nullable: false,
            description: "The ID value of the feature",
        });
        t.string("name", { nullable: false, description: "The name of the feature" });
        t.string("iconUrl", {
            nullable: false,
            description: "The URL value of the icon image of the feature",
        });
        t.string("iconUrl", {
            nullable: true,
            description: "The URL value of the icon colored image of the feature, with color",
        });
    },
});
exports.BeachBarFeatureType = schema_1.objectType({
    name: "BeachBarFeature",
    description: "Represents a #beach_bar's feature (service) & its details",
    definition(t) {
        t.field("service", {
            type: exports.BeachBarServiceType,
            description: "The feature (service) the #beach_bar provides",
            nullable: false,
            resolve: o => o.service,
        });
        t.field("beachBar", {
            type: types_1.BeachBarType,
            description: "The #beach_bar that provides the feature (service)",
            nullable: false,
            resolve: o => o.beachBar,
        });
        t.int("quantity", {
            nullable: false,
            description: "An integer that indicates the quantity of the service, a #beach_bar provides",
            resolve: o => o.quantity,
        });
        t.string("description", {
            nullable: true,
            description: "A short description about the service",
            resolve: o => o.description,
        });
        t.field("updatedAt", { type: common_1.DateTimeScalar, nullable: false });
        t.field("timestamp", { type: common_1.DateTimeScalar, nullable: false });
    },
});
exports.AddBeachBarFeatureType = schema_1.objectType({
    name: "AddBeachBarFeature",
    description: "Info to be returned when a feature is added (assigned) to a #beach_bar",
    definition(t) {
        t.field("feature", {
            type: exports.BeachBarFeatureType,
            description: "The feature that will be added (assigned) to the #beach_bar",
            nullable: false,
            resolve: o => o.feature,
        });
        t.boolean("added", {
            nullable: false,
            description: "A boolean that indicates if the feature has been successfully added (assigned) to the #beach_bar",
        });
    },
});
exports.AddBeachBarFeatureResult = schema_1.unionType({
    name: "AddBeachBarFeatureResult",
    definition(t) {
        t.members("AddBeachBarFeature", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else {
                return "AddBeachBarFeature";
            }
        });
    },
});
exports.UpdateBeachBarFeatureType = schema_1.objectType({
    name: "UpdateBeachBarFeature",
    description: "Info to be returned when the info of a feature of a #beach_bar, are updated",
    definition(t) {
        t.field("feature", {
            type: exports.BeachBarFeatureType,
            description: "The feature that will be updated",
            nullable: false,
            resolve: o => o.feature,
        });
        t.boolean("updated", {
            nullable: false,
            description: "A boolean that indicates if the feature has been successfully updated",
        });
    },
});
exports.UpdateBeachBarFeatureResult = schema_1.unionType({
    name: "UpdateBeachBarFeatureResult",
    definition(t) {
        t.members("UpdateBeachBarFeature", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else {
                return "UpdateBeachBarFeature";
            }
        });
    },
});
//# sourceMappingURL=types.js.map