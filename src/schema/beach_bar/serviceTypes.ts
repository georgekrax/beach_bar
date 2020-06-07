import { objectType } from "@nexus/schema";

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
