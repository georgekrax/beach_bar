import { errors, MyContext } from "@beach_bar/common";
import { ApolloError } from "apollo-server-express";
import { BeachBar } from "entity/BeachBar";
import { BeachBarLocation } from "entity/BeachBarLocation";
import { City } from "entity/City";
import { Country } from "entity/Country";
import { Region } from "entity/Region";
import { extendType, idArg, nullable, stringArg } from "nexus";
import { TAddBeachBarLocation, TUpdateBeachBarLocation } from "typings/beach_bar/location";
import { isAuth, throwScopesUnauthorized } from "utils/auth/payload";
import { AddBeachBarLocationType, UpdateBeachBarLocationType } from "./types";

export const BeachBarLocationCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addBeachBarLocation", {
      type: AddBeachBarLocationType,
      description: "Add (assign) a location to a #beach_bar",
      args: {
        beachBarId: idArg(),
        address: stringArg({ description: "The address of the #beach_bar" }),
        zipCode: nullable(
          stringArg({
            description: "The zip (postal) code of the #beach_bar",
          })
        ),
        latitude: stringArg({ description: "The latitude of the location of the #beach_bar" }),
        longitude: stringArg({ description: "The longitude of the location of the #beach_bar" }),
        countryId: idArg({ description: "The ID value of the country the #beach_bar is located at" }),
        city: stringArg({ description: "The city the #beach_bar is located at" }),
        region: nullable(idArg({ description: "The #beach_bar's region" })),
      },
      resolve: async (
        _,
        { beachBarId, address, zipCode, latitude, longitude, countryId, city, region },
        { payload }: MyContext
      ): Promise<TAddBeachBarLocation> => {
        isAuth(payload);
        throwScopesUnauthorized(payload, errors.YOU_ARE_NOT_BEACH_BAR_PRIMARY_OWNER, ["beach_bar@crud:beach_bar"]);

        if (!latitude || latitude.length > 16 || !longitude || longitude.length > 16)
          throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.INVALID_ARGUMENTS);

        const beachBar = await BeachBar.findOne({
          where: { id: beachBarId },
          relations: ["location", "reviews", "features", "products", "restaurants"],
        });
        if (!beachBar) throw new ApolloError(errors.BEACH_BAR_DOES_NOT_EXIST, errors.NOT_FOUND);

        const country = await Country.findOne(countryId);
        if (!country) throw new ApolloError("Country does not exist", errors.NOT_FOUND);

        let newCity: City | undefined = undefined;
        newCity = await City.findOne({ where: `"name" ILIKE '${city}'` });
        if (!newCity) {
          newCity = City.create({
            name: city,
            countryId: country.id,
            country,
          });
          await newCity.save();
        }

        let newRegion: Region | undefined = undefined;
        if (region) {
          newRegion = await Region.findOne({ where: `"name" ILIKE '${region}'` });
          if (!newRegion) {
            newRegion = Region.create({
              name: region,
              countryId: country.id,
              country: country,
              cityId: city.id,
              city: newCity,
            });
            await newRegion.save();
          }
        }

        const newLocation = BeachBarLocation.create({
          beachBar,
          address,
          zipCode,
          latitude,
          longitude,
          country,
          city: newCity,
          region: newRegion,
        });

        try {
          await newLocation.save();
          await beachBar.updateRedis();
        } catch (err) {
          if (err.message === 'duplicate key value violates unique constraint "beach_bar_location_beach_bar_id_key"')
            throw new ApolloError("You have already set the location of this #beach_bar.", errors.CONFLICT);
          throw new ApolloError(err.message);
        }

        return { location: newLocation, added: true };
      },
    });
    t.field("updateBeachBarLocation", {
      type: UpdateBeachBarLocationType,
      description: "Update the location details of a #beach_bar",
      args: {
        locationId: idArg(),
        address: nullable(stringArg()),
        zipCode: nullable(stringArg()),
        latitude: nullable(stringArg()),
        longitude: nullable(stringArg()),
        countryId: nullable(idArg()),
        city: nullable(stringArg()),
        region: nullable(stringArg()),
      },
      resolve: async (
        _,
        { locationId, address, zipCode, latitude, longitude, countryId, city, region },
        { payload }: MyContext
      ): Promise<TUpdateBeachBarLocation> => {
        isAuth(payload);
        throwScopesUnauthorized(payload, 'You are not allowed to update "this" #beach_bar location details', [
          "beach_bar@crud:beach_bar",
          "beach_bar@update:beach_bar",
        ]);

        const location = await BeachBarLocation.findOne({
          where: { id: locationId },
          relations: ["beachBar", "country", "city", "region"],
        });
        if (!location) throw new ApolloError("#beach_bar location does not exist", errors.NOT_FOUND);

        try {
          const updatedLocation = await location.update({ address, zipCode, latitude, longitude, countryId, city, region });

          return { location: updatedLocation, updated: true };
        } catch (err) {
          throw new ApolloError(err.message);
        }
      },
    });
  },
});
