import { LoginPlatformType } from "config/platformNames";
import { Account } from "entity/Account";
import { LoginDetails, LoginDetailStatus } from "entity/LoginDetails";
import fs from "fs";
import { LoginDetailsType } from "typings/.index";
import { UAParser } from "ua-parser-js";

type findDetailsReturnType = number | undefined;
type findLoginDetailsType = {
  details?: Omit<LoginDetailsType, "osId" | "browserId">;
  uaParser: UAParser;
};

export const findLoginDetails = ({ details, uaParser }: findLoginDetailsType): LoginDetailsType => {
  const obj: LoginDetailsType = {
    osId: undefined,
    browserId: undefined,
    countryId: undefined,
    cityId: details?.cityId || undefined,
  };
  if (details) {
    const osName = uaParser.getOS().name || undefined;
    if (osName) {
      obj.osId = findOs(osName);
    }
    const browserName = uaParser.getBrowser().name || undefined;
    if (browserName) {
      obj.browserId = findOs(browserName);
    }
    if (details.countryId) {
      obj.countryId = findCountry(details.countryId);
    }
  }
  return obj;
};

export const createUserLoginDetails = async (
  status: LoginDetailStatus,
  platform: LoginPlatformType,
  account: Account,
  osId?: number,
  browserId?: number,
  countryId?: number,
  cityId?: bigint,
  ipAddr?: string
): Promise<void> => {
  const loginDetails = LoginDetails.create({
    account,
    platformId: platform.id,
    browserId,
    osId,
    countryId,
    cityId,
    ipAddr,
    status,
  });

  try {
    await loginDetails.save();
  } catch (err) {
    throw new Error(err.message);
  }
};

export const findOs = (osName: unknown): findDetailsReturnType => {
  if (!osName) {
    return undefined;
  }
  console.log(osName);
  const file = JSON.parse(fs.readFileSync("../../config/clientOs.json", "utf8"));
  const os = file.data.find(data => data.name === osName);
  console.log(os);
  if (!os) {
    return undefined;
  }
  return os.id;
};

export const findBrowser = (browserName: unknown): findDetailsReturnType => {
  if (!browserName) {
    return undefined;
  }
  console.log(browserName);
  const file = JSON.parse(fs.readFileSync("../../config/clientBrowser.json.json", "utf8"));
  const browser = file.data.find(data => data.name === browserName);
  console.log(browser);
  if (!browser) {
    return undefined;
  }
  return browser.id;
};

export const findCountry = (countryId: number | undefined): findDetailsReturnType => {
  if (!countryId) {
    return undefined;
  }
  console.log(countryId);
  const file = JSON.parse(fs.readFileSync("../../config/countries.json.json", "utf8"));
  const country = file.data.find(data => Number(data.id) === Number(countryId));
  console.log(country);
  if (!country) {
    return undefined;
  }
  return country.id;
};
