import { objectType, unionType } from "@nexus/schema";

export const BeachBarFeatureType = objectType({
  name: "BeachBarFeature",
  description: "Represents a #beach_bar's feature (service)",
  definition(t) {
    t.int("id", {
      nullable: false,
      description: "The ID value of the feature",
      resolve: o => o.service.id,
    });
    t.string("name", { nullable: false, description: "The name of the feature", resolve: o => o.service.name });
    t.string("iconUrl", {
      nullable: false,
      description: "The URL value of the icon image of the feature",
      resolve: o => o.service.iconUrl,
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
  },
});

export const AddBeachBarFeatureType = objectType({
  name: "AddBeachBarFeature",
  description: "Info to be returned when a feature is added (assigned) to a #beach_bar",
  definition(t) {
    t.field("feature", {
      type: BeachBarFeatureType,
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

export const AddBeachBarFeatureResult = unionType({
  name: "AddBeachBarFeatureResult",
  definition(t) {
    t.members("AddBeachBarFeature", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "AddBeachBarFeature";
      }
    });
  },
});
