import { errors, MyContext } from "@beach_bar/common";
import { BeachBar } from "entity/BeachBar";
import { BeachBarLocation } from "entity/BeachBarLocation";
import { City } from "entity/City";
import { Country } from "entity/Country";
import { Region } from "entity/Region";
import { extendType, idArg, intArg, nullable, stringArg } from "nexus";
import { AddBeachBarLocationType, UpdateBeachBarLocationType } from "typings/beach_bar/location";
import { checkScopes } from "utils/checkScopes";
import { AddBeachBarLocationResult, UpdateBeachBarLocationResult } from "./types";

export const BeachBarLocationCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addBeachBarLocation", {
      type: AddBeachBarLocationResult,
      description: "Add (assign) a location to a #beach_bar",
      args: {
        beachBarId: intArg({ description: "The ID value of the #beach_bar" }),
        address: stringArg({ description: "The address of the #beach_bar" }),
        zipCode: nullable(
          stringArg({
            description: "The zip (postal) code of the #beach_bar",
          })
        ),
        latitude: stringArg({ description: "The latitude of the location of the #beach_bar" }),
        longitude: stringArg({ description: "The longitude of the location of the #beach_bar" }),
        countryId: idArg({ description: "The ID value of the country the #beach_bar is located at" }),
        cityId: idArg({ description: "The ID value of the city the #beach_bar is located at" }),
        regionId: nullable(intArg({ description: "The ID value of the #beach_bar region" })),
      },
      resolve: async (
        _,
        { beachBarId, address, zipCode, latitude, longitude, countryId, cityId, regionId },
        { payload }: MyContext
      ): Promise<AddBeachBarLocationType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!checkScopes(payload, ["beach_bar@crud:beach_bar"])) {
          return {
            error: { code: errors.UNAUTHORIZED_CODE, message: errors.NOT_REGISTERED_PRIMARY_OWNER },
          };
        }

        if (!beachBarId || beachBarId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: errors.SOMETHING_WENT_WRONG } };
        }
        if (!latitude || latitude.length > 16) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: errors.SOMETHING_WENT_WRONG } };
        }
        if (!longitude || longitude.length > 16) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: errors.SOMETHING_WENT_WRONG } };
        }
        if (!countryId || countryId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid country" } };
        }
        if (!cityId || cityId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid city" } };
        }

        const beachBar = await BeachBar.findOne({
          where: { id: beachBarId },
          relations: ["location", "reviews", "features", "products", "entryFees", "restaurants"],
        });
        if (!beachBar) {
          return { error: { code: errors.CONFLICT, message: errors.BEACH_BAR_DOES_NOT_EXIST } };
        }

        const country = await Country.findOne(countryId);
        if (!country) {
          return { error: { code: errors.CONFLICT, message: "Specified country does not exist" } };
        }
        const city = await City.findOne(cityId);
        if (!city) {
          return { error: { code: errors.CONFLICT, message: "Specified city does not exist" } };
        }

        let region: Region | undefined = undefined;
        if (regionId) {
          const beachBarRegion = await Region.findOne(regionId);
          if (!region) {
            return { error: { code: errors.CONFLICT, message: "Specified region does not exist" } };
          }
          region = beachBarRegion;
        }

        const newLocation = BeachBarLocation.create({
          beachBar,
          address,
          zipCode,
          latitude,
          longitude,
          country,
          city,
          region,
        });

        try {
          await newLocation.save();
          await beachBar.updateRedis();
        } catch (err) {
          if (err.message === 'duplicate key value violates unique constraint "beach_bar_location_beach_bar_id_key"') {
            return { error: { code: errors.CONFLICT, message: "You have already set the location of this #beach_bar" } };
          }
          return { error: { message: `${errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
        }

        return {
          location: newLocation,
          added: true,
        };
      },
    });
    t.field("updateBeachBarLocation", {
      type: UpdateBeachBarLocationResult,
      description: "Update the location details of a #beach_bar",
      args: {
        locationId: intArg({ description: "The ID value of the #beach_bar location" }),
        address: nullable(stringArg({ description: "The address of the #beach_bar" })),
        zipCode: nullable(
          stringArg({
            description: "The zip (postal) code of the #beach_bar",
          })
        ),
        latitude: nullable(stringArg({ description: "The latitude of the location of the #beach_bar" })),
        longitude: nullable(stringArg({ description: "The longitude of the location of the #beach_bar" })),
        countryId: nullable(intArg({ description: "The ID value of the country the #beach_bar is located at" })),
        cityId: nullable(intArg({ description: "The ID value of the city the #beach_bar is located at" })),
        regionId: nullable(intArg({ description: "The ID value of the #beach_bar region" })),
      },
      resolve: async (
        _,
        { locationId, address, zipCode, latitude, longitude, countryId, cityId, regionId },
        { payload }: MyContext
      ): Promise<UpdateBeachBarLocationType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!checkScopes(payload, ["beach_bar@crud:beach_bar", "beach_bar@update:beach_bar"])) {
          return {
            error: { code: errors.UNAUTHORIZED_CODE, message: "You are not allowed to update 'this' #beach_bar location details" },
          };
        }

        if (!locationId || locationId <= 0) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: errors.SOMETHING_WENT_WRONG } };
        }

        const location = await BeachBarLocation.findOne({
          where: { id: locationId },
          relations: ["beachBar", "country", "city", "region"],
        });
        if (!location) {
          return { error: { code: errors.CONFLICT, message: errors.SOMETHING_WENT_WRONG } };
        }

        try {
          const updatedLocation = await location.update(address, zipCode, latitude, longitude, countryId, cityId, regionId);

          return {
            location: updatedLocation,
            updated: true,
          };
        } catch (err) {
          return { error: { message: `${errors.SOMETHING_WENT_WRONG}${err.message ? `: ${err.message}` : ""}}` } };
        }
      },
    });
  },
});
