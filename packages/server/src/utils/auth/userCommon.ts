import { LoginPlatformType } from "@/config/platformNames";
import { NexusGenInputs } from "@/graphql/generated/nexusTypes";
import { Account, LoginDetails } from "@prisma/client";
import { BROWSERS_ARR, COUNTRIES_ARR, OS_ARR } from "@the_hashtag/common";
import UAParser from "ua-parser-js";
import { prisma } from "../../index";

// findLoginDetails()
type FindDetailsReturn = number | null;
type FindLoginDetailsOptions = {
  details?: NexusGenInputs["UserLoginDetails"] | null;
  uaParser: UAParser;
};
type FindLoginDetailsReturn = Pick<LoginDetails, "city" | "osId" | "browserId" | "countryId">;

export const findLoginDetails = ({ details, uaParser }: FindLoginDetailsOptions): FindLoginDetailsReturn => ({
  city: details?.city || null,
  osId: findOs(uaParser.getOS().name),
  browserId: findOs(uaParser.getBrowser().name),
  countryId: findCountry(details?.countryAlpha2Code || ""),
});

// createLoginDetails()
type CreateLoginDetailsOptions = {
  platform: LoginPlatformType;
  account: Account;
} & Pick<LoginDetails, "status" | "osId" | "browserId" | "countryId" | "city" | "ipAddr">;

export const createLoginDetails = async ({ platform, account, ...rest }: CreateLoginDetailsOptions): Promise<void> => {
  try {
    await prisma.loginDetails.create({ data: { ...rest, accountId: account.id, platformId: platform.id } });
  } catch (err) {
    throw new Error(err.message);
  }
};

export const findOs = (osName?: string): FindDetailsReturn => {
  if (!osName) return null;
  const os = OS_ARR.find(({ name }) => name.toLowerCase() === osName.toLowerCase());
  return os?.id || null;
};

export const findBrowser = (browserName?: string): FindDetailsReturn => {
  if (!browserName) return null;
  const browser = BROWSERS_ARR.find(({ name }) => name.toLowerCase() === browserName.toLowerCase());
  return browser?.id || null;
};

export const findCountry = (countryCode?: string): FindDetailsReturn => {
  if (!countryCode) return null;
  const country = COUNTRIES_ARR.find(({ alpha2Code }) => alpha2Code === countryCode);
  return country?.id || null;
};
