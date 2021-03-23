import { BROWSERS_ARR, COUNTRIES_ARR, OS_ARR } from "@the_hashtag/common";
import { LoginPlatformType } from "config/platformNames";
import { Account } from "entity/Account";
import { LoginDetails, LoginDetailStatus } from "entity/LoginDetails";
import { LoginDetailsType } from "typings/.index";
import UAParser from "ua-parser-js";

type findDetailsReturnType = number | undefined;
type findLoginDetailsType = {
  details?: Omit<LoginDetailsType, "osId" | "browserId">;
  uaParser: UAParser;
};

export const findLoginDetails = ({ details, uaParser }: findLoginDetailsType): LoginDetailsType => {
  const obj: LoginDetailsType = {
    osId: undefined,
    browserId: undefined,
    countryAlpha2Code: undefined,
    city: details?.city || undefined,
  };
  if (details) {
    const osName = uaParser.getOS().name || undefined;
    if (osName) obj.osId = findOs(osName);
    const browserName = uaParser.getBrowser().name || undefined;
    if (browserName) obj.browserId = findOs(browserName);
    if (details.countryAlpha2Code) obj.countryId = findCountry(details.countryAlpha2Code);
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
  city?: string,
  ipAddr?: string
): Promise<void> => {
  const loginDetails = LoginDetails.create({
    account,
    platformId: platform.id,
    browserId,
    osId,
    countryId,
    city,
    ipAddr: ipAddr || undefined,
    status,
  });

  try {
    await loginDetails.save();
  } catch (err) {
    throw new Error(err.message);
  }
};

export const findOs = (osName: string): findDetailsReturnType => {
  if (!osName) return undefined;
  const os = OS_ARR.find(({ name }) => name.toLowerCase() === osName.toLowerCase());
  if (!os) return undefined;
  return os.id;
};

export const findBrowser = (browserName: string): findDetailsReturnType => {
  if (!browserName) return undefined;
  const browser = BROWSERS_ARR.find(({ name }) => name.toLowerCase() === browserName.toLowerCase());
  if (!browser) return undefined;
  return browser.id;
};

export const findCountry = (countryCode?: string): findDetailsReturnType => {
  if (!countryCode) return undefined;
  const country = COUNTRIES_ARR.find(({ alpha2Code }) => alpha2Code === countryCode);
  if (!country) return undefined;
  return country.id;
};
