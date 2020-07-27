import { City } from "@entity/City";
import { Country } from "@entity/Country";
import { Account } from "@entity/Account";
import clientBrowser from "../../models/clientBrowser";
import clientOs from "../../models/clientOs";
import loginDetails from "../../models/loginDetails";
import Platform from "../../models/platform";

export const switchPlatform = async (urlHostname: string): Promise<any | Error> => {
  const platform = await Platform.findOne({ urlHostname });

  if (!platform) {
    throw new Error("Could not find specified platform");
  }

  return platform;
};

export const createUserLoginDetails = async (
  status: string,
  platformName: string,
  account: Account,
  clientOs?: any,
  clientBrowser?: any,
  country?: Country,
  city?: City,
  ipAddr?: string
): Promise<void> => {
  // pass beach_bar platform to user login details
  const platform = await Platform.findOne({ name: platformName });
  if (!platform) {
    throw new Error();
  }
  await loginDetails.create({
    accountId: account.id,
    platformId: platform._id,
    status,
    osId: clientOs ? clientOs._id : undefined,
    browserId: clientBrowser ? clientBrowser._id : undefined,
    countryId: country ? country.id : undefined,
    cityId: city ? city.id : undefined,
    ipAddr,
  });
};

export const findOs = async (osName: string): Promise<any | null> => {
  if (!osName) {
    return null;
  }
  const os = await clientOs.findOne({ name: osName });
  if (!os) {
    throw new Error("Invalid OS name");
  }
  return os;
};

export const findBrowser = async (browserName: string): Promise<any | null> => {
  if (!browserName) {
    return null;
  }
  const browser = await clientBrowser.findOne({ name: browserName });
  if (!browser) {
    throw new Error("Invalid browser name");
  }
  return browser;
};

export const findCountry = async (countryName: string): Promise<Country | null> => {
  if (!countryName) {
    return null;
  }
  const country = await Country.findOne({ where: { name: countryName } });
  if (!country) {
    throw new Error("Invalid country name");
  }
  return country;
};

export const findCity = async (cityName: string): Promise<City | null> => {
  if (!cityName) {
    return null;
  }
  const city = await City.findOne({ where: { name: cityName } });
  if (!city) {
    throw new Error("Invalid city name");
  }
  return city;
};
