import { ConfigContextType } from "@hashtag-design-system/components";
import { IpAddrType } from "./graphql";

export type ConfigType = ConfigContextType<{}, { ipAddr?: IpAddrType }>;
