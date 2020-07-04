import { City } from "../../entity/City";
import { Account } from "../../entity/Account";
import { Country } from "../../entity/Country";
import { Platform } from "../../entity/Platform";
import { ClientBrowser, ClientOs } from "../../entity/ClientOs&Browser";
import { loginDetailStatus, LoginDetails } from "../../entity/LoginDetails";

export const switchPlatform = async (urlHostname: string): Promise<Platform | Error> => {
  const platform = await Platform.findOne({ urlHostname });

  if (!platform) {
    throw new Error("Could not find specified platform");
  }

  return platform;
};

export const createUserLoginDetails = async (
  status: loginDetailStatus,
  platform: Platform,
  account: Account,
  clientOs: ClientOs | null,
  clientBrowser: ClientBrowser | null,
  country: Country | null,
  city: City | null,
  ipAddr: string | null,
): Promise<void> => {
  const userLoginDetails = LoginDetails.create({
    status,
    platform,
    account,
  });
  if (clientOs) {
    userLoginDetails.clientOs = clientOs;
  }
  if (clientBrowser) {
    userLoginDetails.clientBrowser = clientBrowser;
  }
  if (country) {
    userLoginDetails.country = country;
  }
  if (city) {
    userLoginDetails.city = city;
  }
  if (ipAddr) {
    userLoginDetails.ipAddr = ipAddr;
  }
  await userLoginDetails.save();
};

export const findOs = async (osName: string): Promise<ClientOs | null> => {
  if (!osName) {
    return null;
  }
  const os = await ClientOs.findOne({ where: { name: osName } });
  if (!os) {
    throw new Error("Invalid OS name");
  }
  return os;
};

export const findBrowser = async (browserName: string): Promise<ClientBrowser | null> => {
  if (!browserName) {
    return null;
  }
  const browser = await ClientBrowser.findOne({ where: { name: browserName } });
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
