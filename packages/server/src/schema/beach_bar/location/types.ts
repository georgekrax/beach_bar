import { resolve } from "@/utils/data";
import { objectType } from "nexus";
import { BeachBarLocation } from "nexus-prisma";

export const BeachBarLocationType = objectType({
  name: BeachBarLocation.$name,
  description: "Represents a #beach_bar's location details",
  definition(t) {
    // t.id("id");
    // t.string("address", { description: "The street address of the #beach_bar" });
    // t.nullable.string("zipCode", { description: "The zip code of the #beach_bar, for its street address" });
    // t.float("latitude", { description: "The latitude of the #beach_bar in the maps, provided by Mapbox" });
    // t.float("longitude", { description: "The longitude of the #beach_bar in the maps, provided by Mapbox" });
    // t.field("country", { type: CountryType, description: "The country the #beach_bar is located at" });
    // t.field("city", { type: CityType, description: "The city the #beach_bar is located at" });
    // t.nullable.field("region", { type: RegionType, description: "The region the #beach_bar is located at" });
    t.field(BeachBarLocation.id);
    t.field(BeachBarLocation.address);
    t.field(BeachBarLocation.zipCode);
    t.field(BeachBarLocation.latitude);
    t.field(BeachBarLocation.longitude);
    t.field(resolve(BeachBarLocation.country));
    t.field(resolve(BeachBarLocation.city));
    t.field(resolve(BeachBarLocation.region));
    // * The where_is column is calculated with a trigger before insert on the DB side, so it will be null at creation
    t.nullable.list.float("whereIs", {
      description: "The 'point' value generated from latitude & longitude, provided by the PostGIS PostgreSQL extension",
      // @ts-expect-error
      resolve: o => o.whereIs.coordinates || null,
    });
    t.string("formattedLocation", {
      description: "Get the location of the #beach_bar formatted",
      resolve: async (_location): Promise<string> => {
        const location = _location as any;
        if (!location) return "";

        let formattedLocation: string[] = [];
        if (location.region) formattedLocation.push(location.region.name);
        if (location.city) formattedLocation.push(location.city.name);
        if (location.country) formattedLocation.push(location.country.alpha2Code);
        return formattedLocation.join(", ");
      },
    });
  },
});

// export const AddBeachBarLocationType = objectType({
//   name: "AddBeachBarLocation",
//   description: "Info to be returned when location is added (assigned) to a #beach_bar",
//   definition(t) {
//     t.field("location", { type: BeachBarLocationType, description: "The location of the #beach_bar that is added" });
//     t.boolean("added", { description: "A boolean that indicates if the #beach_bar locations has been successfully being added" });
//   },
// });

// export const AddBeachBarLocationResult = unionType({
//   name: "AddBeachBarLocationResult",
//   definition(t) {
//     t.members("AddBeachBarLocation", "Error");
//   },
//   resolveType: item => {
//     if (item.error) {
//       return "Error";
//     } else {
//       return "AddBeachBarLocation";
//     }
//   },
// });

// export const UpdateBeachBarLocationType = objectType({
//   name: "UpdateBeachBarLocation",
//   description: "Info to be returned when the details of #beach_bar location are updated",
//   definition(t) {
//     t.field("location", { type: BeachBarLocationType, description: "The #beach_bar location that is updated" });
//     t.boolean("updated", {
//       description: "A boolean that indicates if the #beach_bar location details have been successfully updated",
//     });
//   },
// });

// export const UpdateBeachBarLocationResult = unionType({
//   name: "UpdateBeachBarLocationResult",
//   definition(t) {
//     t.members("UpdateBeachBarLocation", "Error");
//   },
//   resolveType: item => {
//     if (item.error) {
//       return "Error";
//     } else {
//       return "UpdateBeachBarLocation";
//     }
//   },
// });
