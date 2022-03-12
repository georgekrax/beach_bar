import { resolve } from "@/utils/data";
import { objectType } from "nexus";
import { BeachBarFeature, BeachBarService } from "nexus-prisma";

export const BeachBarServiceType = objectType({
  name: BeachBarService.$name,
  description: "Represents a service (feature), which a #beach_bar can provide",
  definition(t) {
    // t.id("id");
    // t.string("name");
    // t.field("icon", { type: IconType, description: "Details about which icon to be used in the front-end" });
    t.field(BeachBarService.id);
    t.field(BeachBarService.name);
    t.field(resolve(BeachBarService.icon));
  },
});

export const BeachBarFeatureType = objectType({
  name: BeachBarFeature.$name,
  description: "Represents a #beach_bar's feature (service) & its details",
  definition(t) {
    // t.id("id");
    // t.int("quantity", { description: "An integer that indicates the quantity of the service, a #beach_bar provides" });
    // t.nullable.string("description", { description: "A short description about the service" });
    // t.field("service", { type: BeachBarServiceType, description: "The feature (service) the #beach_bar provides" });
    // t.field("beachBar", { type: BeachBarType, description: "The #beach_bar that provides the feature (service)" });
    // t.field("updatedAt", { type: DateTime.name });
    // t.field("timestamp", { type: DateTime.name });
    t.field(BeachBarFeature.id);
    t.field(BeachBarFeature.quantity);
    t.field(BeachBarFeature.description);
    t.field(resolve(BeachBarFeature.service));
    t.field(resolve(BeachBarFeature.beachBar));
    t.field(BeachBarFeature.timestamp);
    t.field(BeachBarFeature.updatedAt);
  },
});

// export const AddBeachBarFeatureType = objectType({
//   name: "AddBeachBarFeature",
//   description: "Info to be returned when a feature is added (assigned) to a #beach_bar",
//   definition(t) {
//     t.field("feature", { type: BeachBarFeatureType, description: "The feature that will be added (assigned) to the #beach_bar" });
//     t.boolean("added", {
//       description: "A boolean that indicates if the feature has been successfully added (assigned) to the #beach_bar",
//     });
//   },
// });

// export const AddBeachBarFeatureResult = unionType({
//   name: "AddBeachBarFeatureResult",
//   definition(t) {
//     t.members("AddBeachBarFeature", "Error");
//   },
//   resolveType: item => {
//     if (item.error) return "Error";
//     else return "AddBeachBarFeature";
//   },
// });

// export const UpdateBeachBarFeatureType = objectType({
//   name: "UpdateBeachBarFeature",
//   description: "Info to be returned when the info of a feature of a #beach_bar, are updated",
//   definition(t) {
//     t.field("feature", { type: BeachBarFeatureType, description: "The feature that will be updated" });
//     t.boolean("updated", { description: "A boolean that indicates if the feature has been successfully updated" });
//   },
// });

// export const UpdateBeachBarFeatureResult = unionType({
//   name: "UpdateBeachBarFeatureResult",
//   definition(t) {
//     t.members("UpdateBeachBarFeature", "Error");
//   },
//   resolveType: item => {
//     if (item.error) return "Error";
//     else return "UpdateBeachBarFeature";
//   },
// });
