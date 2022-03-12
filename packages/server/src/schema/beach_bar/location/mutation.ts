import { isAuth, throwScopesUnauthorized } from "@/utils/auth";
import { updateRedis } from "@/utils/db";
import { errors } from "@beach_bar/common";
import { City, Region } from "@prisma/client";
import { COUNTRIES_ARR } from "@the_hashtag/common";
import { ApolloError } from "apollo-server-express";
import { extendType, idArg, nullable, stringArg } from "nexus";
import { BeachBarLocationType } from "./types";

export const BeachBarLocationCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addBeachBarLocation", {
      type: BeachBarLocationType,
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
        { prisma, payload }
      ) => {
        isAuth(payload);
        throwScopesUnauthorized(payload, errors.YOU_ARE_NOT_BEACH_BAR_PRIMARY_OWNER, ["beach_bar@crud:beach_bar"]);

        if (!latitude || latitude.length > 16 || !longitude || longitude.length > 16) {
          throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.INVALID_ARGUMENTS);
        }

        const beachBar = await prisma.beachBar.findUnique({ where: { id: +beachBarId } });
        if (!beachBar) throw new ApolloError(errors.BEACH_BAR_DOES_NOT_EXIST, errors.NOT_FOUND);

        const country = COUNTRIES_ARR.find(({ id }) => id.toString() === countryId.toString());
        if (!country) throw new ApolloError("Country does not exist", errors.NOT_FOUND);

        let newCity: City | null = null;
        const cityId = +city;
        newCity = await prisma.city.findFirst({
          where: isNaN(cityId) ? { name: { contains: city, mode: "insensitive" } } : { id: cityId },
        });
        if (!newCity) newCity = await prisma.city.create({ data: { name: city, countryId: country.id } });

        let newRegion: Region | null = null;
        const regionId = +(region || 0);
        if (region) {
          newRegion = await prisma.region.findFirst({
            where: isNaN(regionId) ? { name: { contains: region.toString(), mode: "insensitive" } } : { id: regionId },
          });
          if (!newRegion) {
            newRegion = await prisma.region.create({ data: { name: region.toString(), countryId: country.id, cityId: newCity?.id } });
          }
        }

        try {
          const newLocation = await prisma.beachBarLocation.create({
            data: {
              beachBarId: beachBar.id,
              countryId: country.id,
              cityId: newCity.id,
              regionId: newRegion?.id,
              address,
              zipCode,
              latitude,
              longitude,
            },
          });
          await updateRedis({ model: "BeachBar", id: beachBar.id });
          return newLocation;
        } catch (err) {
          if (err.message === 'duplicate key value violates unique constraint "beach_bar_location_beach_bar_id_key"') {
            throw new ApolloError("You have already set the location of this #beach_bar.", errors.CONFLICT);
          }
          throw new ApolloError(err.message);
        }
      },
    });
    t.field("updateBeachBarLocation", {
      type: BeachBarLocationType,
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
      resolve: async (_, { locationId, address, latitude, longitude, countryId, city, region, ...args }, { prisma, payload }) => {
        isAuth(payload);
        throwScopesUnauthorized(payload, 'You are not allowed to update "this" #beach_bar location details', [
          "beach_bar@crud:beach_bar",
          "beach_bar@update:beach_bar",
        ]);

        const location = await prisma.beachBarLocation.findUnique({
          where: { id: +locationId },
          include: { city: true, region: true },
        });
        if (!location) throw new ApolloError("#beach_bar location does not exist", errors.NOT_FOUND);

        try {
          let newCity: City | null | undefined = undefined;
          if (city && city.toLowerCase() !== location.city.name.toLowerCase()) {
            newCity = await prisma.city.findFirst({ where: { name: { contains: city } } });
            if (!newCity) newCity = await prisma.city.create({ data: { name: city, countryId: location.countryId } });
          }
          let newRegion: Region | null | undefined = undefined;
          if (region && region.toLowerCase() !== location.region?.name.toLowerCase()) {
            newRegion = await prisma.region.findFirst({ where: { name: { contains: region } } });
            if (!newRegion) {
              newRegion = await prisma.region.create({
                data: { name: region, countryId: location.countryId, cityId: location.cityId },
              });
            }
          }

          const updatedLocation = await prisma.beachBarLocation.update({
            where: { id: location.id },
            include: { city: true, country: true },
            data: {
              ...args,
              address: address || undefined,
              latitude: latitude || undefined,
              longitude: longitude || undefined,
              countryId: countryId ? +countryId : undefined,
              cityId: newCity?.id,
              regionId: newRegion?.id,
            },
          });
          await updateRedis({ model: "BeachBar", id: location.beachBarId });
          return updatedLocation;
        } catch (err) {
          throw new ApolloError(err.message);
        }
      },
    });
  },
});
