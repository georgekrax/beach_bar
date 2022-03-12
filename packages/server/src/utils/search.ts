import { Prisma } from "@prisma/client";
import { generateId } from "@the_hashtag/common";
import { prisma } from "..";

export const FormatInputValueInclude = Prisma.validator<Prisma.SearchInputValueInclude>()({
  beachBar: true,
  city: true,
  country: true,
  region: true,
});
type FormatInputValueModel = Prisma.SearchInputValueGetPayload<{ include: typeof FormatInputValueInclude }>;

export const formatInputValue = ({ beachBar, country, city, region }: FormatInputValueModel) => {
  let formattedString = "";
  if (beachBar) {
    formattedString = beachBar.name;
    return formattedString;
  } else {
    if (country) {
      // if (country.alpha2Code && country.alpha2Code.trim().length > 0) {
      //   formattedString = country.alpha2Code;
      // } else {
      formattedString = country.name;
      // }
    }
    if (city) {
      formattedString = city.name;
      if (country) formattedString = formattedString.concat(", " + country.name);
    }
    if (region) {
      formattedString = region.name;
      if (city && country) formattedString = formattedString.concat(", " + city.name, ", " + country.name);
      else if (city) formattedString = formattedString.concat(", " + city.name);
      else if (country) formattedString = formattedString.concat(", " + country.name);
    }
  }
  return formattedString;
};

// updateSearchInputValues()
const UpdateSearchInputValuesInclude = Prisma.validator<Prisma.BeachBarInclude>()({ location: true });
type UpdateSearchInputValuesModel = Prisma.BeachBarGetPayload<{ include: typeof UpdateSearchInputValuesInclude }>;

export const updateSearchInputValues = async ({ id, isActive, location }: UpdateSearchInputValuesModel): Promise<void> => {
  const inputValue = await prisma.searchInputValue.findFirst({ where: { beachBarId: id } });
  if (inputValue) await prisma.searchInputValue.delete({ where: { id: inputValue.id } });
  else if (isActive) {
    await prisma.searchInputValue.updateMany({ where: { beachBarId: id, deletedAt: { not: null } }, data: { deletedAt: null } });

    try {
      const { countryId, cityId, regionId } = location!;
      const searchInputs = await prisma.searchInputValue.findMany({
        where: { OR: [{ beachBarId: id }, { countryId }, { countryId, cityId }, { countryId, cityId, regionId }] },
      });
      if (!searchInputs.find(({ beachBarId }) => beachBarId?.toString() === id.toString())) {
        await prisma.searchInputValue.create({ data: { beachBarId: id, publicId: generateId({ length: 5, numbersOnly: true }) } });
      }
      if (!searchInputs.find(input => input.countryId?.toString() === countryId.toString())) {
        await prisma.searchInputValue.create({ data: { countryId, publicId: generateId({ length: 5, numbersOnly: true }) } });
      }
      if (
        !searchInputs.find(
          input => input.cityId?.toString() === cityId.toString() && input.countryId?.toString() === countryId.toString()
        )
      ) {
        await prisma.searchInputValue.create({ data: { countryId, cityId, publicId: generateId({ length: 5, numbersOnly: true }) } });
      }
      if (
        regionId &&
        !searchInputs.find(
          input =>
            input.regionId?.toString() === regionId.toString() &&
            input.cityId?.toString() === cityId.toString() &&
            input.countryId?.toString() === countryId.toString()
        )
      ) {
        await prisma.searchInputValue.create({
          data: { countryId, cityId, regionId, publicId: generateId({ length: 5, numbersOnly: true }) },
        });
      }
    } catch {}
  }
};
