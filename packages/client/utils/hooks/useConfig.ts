import { useConfigContext } from "@hashtag-design-system/components";
import { ConfigType } from "../../typings/hooks";

export const useConfig = () => {
  return useConfigContext<ConfigType>()
}
