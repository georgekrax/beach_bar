import { MOTION } from "@/config/index";
import { SearchContextType } from "@/utils/contexts";
import { AnimationControls, motion } from "framer-motion";
import Image from "next/image";
import { useMemo } from "react";
import { HANDLE_SELECT_PAYLOAD } from "../reducer";
import styles from "./Suggestion.module.scss";

type InfoObj = {
  primary: string;
  secondary?: string;
};

type Props = {
  idx: number;
  itemControls: AnimationControls;
  onClick?: (info: HANDLE_SELECT_PAYLOAD) => void;
} &SearchContextType["inputValue"];

export const Suggestion: React.FC<Props> = ({ idx, itemControls, beachBar, country, city, region, onClick, ...props }) => {
  const info = useMemo(() => {
    let value: InfoObj = {
      primary: "",
      secondary: undefined,
    };
    if (beachBar) value = { primary: beachBar.name, secondary: beachBar.formattedLocation };
    else if (region)
      value = {
        primary: region.name,
        secondary: (city ? city.name : "") + (country ? `, ${country?.alpha2Code}` : ""),
      };
    else if (city) value = { primary: city.name, secondary: country?.name };
    else if (country) value = { primary: country.name };
    return value;
  }, [beachBar, country, city, region]);

  return (
    <motion.li
      className={styles.container + " flex-row-space-between-center"}
      animate={itemControls}
      exit="initial"
      variants={MOTION.searchItemVariants}
      custom={idx + 1}
      onClick={() => onClick && onClick({ ...props, beachBar, country, city, region, content: info.primary })}
    >
      <div className={styles.itemContent + " flex-column-center-flex-start"}>
        <div className="header-6 semibold">{info.primary}</div>
        {info.secondary && <div>{info.secondary}</div>}
      </div>
      {beachBar && (
        <Image src={beachBar.thumbnailUrl} className={styles.img} width={60} height={60} objectFit="cover" />
      )}
    </motion.li>
  );
};

Suggestion.displayName = "SearchFormSuggestion";
