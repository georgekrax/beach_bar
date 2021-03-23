import { DateTimeScalar } from "@the_hashtag/common/dist/graphql";
import { objectType, unionType } from "nexus";
import { BeachBarType } from "../types";

export const BeachBarServiceType = objectType({
  name: "BeachBarService",
  description: "Represents a service (feature), which a #beach_bar can provide",
  definition(t) {
    t.id("id", {
      description: "The ID value of the feature",
    });
    t.string("name", { description: "The name of the feature" });
  },
});

export const BeachBarFeatureType = objectType({
  name: "BeachBarFeature",
  description: "Represents a #beach_bar's feature (service) & its details",
  definition(t) {
    t.field("service", {
      type: BeachBarServiceType,
      description: "The feature (service) the #beach_bar provides",
      resolve: o => o.service,
    });
    t.field("beachBar", {
      type: BeachBarType,
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
    t.field("updatedAt", { type: DateTimeScalar });
    t.field("timestamp", { type: DateTimeScalar });
  },
});

export const AddBeachBarFeatureType = objectType({
  name: "AddBeachBarFeature",
  description: "Info to be returned when a feature is added (assigned) to a #beach_bar",
  definition(t) {
    t.field("feature", {
      type: BeachBarFeatureType,
      description: "The feature that will be added (assigned) to the #beach_bar",
      resolve: o => o.feature,
    });
    t.boolean("added", {
      description: "A boolean that indicates if the feature has been successfully added (assigned) to the #beach_bar",
    });
  },
});

export const AddBeachBarFeatureResult = unionType({
  name: "AddBeachBarFeatureResult",
  definition(t) {
    t.members("AddBeachBarFeature", "Error");
  },
  resolveType: item => {
    if (item.error) {
      return "Error";
    } else {
      return "AddBeachBarFeature";
    }
  },
});

export const UpdateBeachBarFeatureType = objectType({
  name: "UpdateBeachBarFeature",
  description: "Info to be returned when the info of a feature of a #beach_bar, are updated",
  definition(t) {
    t.field("feature", {
      type: BeachBarFeatureType,
      description: "The feature that will be updated",
      resolve: o => o.feature,
    });
    t.boolean("updated", {
      description: "A boolean that indicates if the feature has been successfully updated",
    });
  },
});

export const UpdateBeachBarFeatureResult = unionType({
  name: "UpdateBeachBarFeatureResult",
  definition(t) {
    t.members("UpdateBeachBarFeature", "Error");
  },
  resolveType: item => {
    if (item.error) {
      return "Error";
    } else {
      return "UpdateBeachBarFeature";
    }
  },
});
