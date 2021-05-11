<<<<<<< HEAD
import { MOTION } from "@/config/index";
import { SearchContextType } from "@/utils/contexts";
import { genBarThumbnailAlt } from "@/utils/format";
import { useSearchForm } from "@/utils/hooks";
import { AnimationControls, motion } from "framer-motion";
import Image from "next/image";
import { useMemo } from "react";
import { HANDLE_SELECT_PAYLOAD } from "../index";
import styles from "./Suggestion.module.scss";

type Props = {
  idx: number;
  itemControls: AnimationControls;
  onClick?: (info: HANDLE_SELECT_PAYLOAD) => void;
} & SearchContextType["inputValue"];

export const Suggestion: React.FC<Props> = ({
  idx,
  itemControls,
  beachBar,
  country,
  city,
  region,
  onClick,
  ...props
}) => {
  const {formatInputValue} = useSearchForm();
  const { primary, secondary } = useMemo(() => formatInputValue({ beachBar, country, city, region }), [
    beachBar,
    country,
    city,
    region,
  ]);

  return (
    <motion.li
      className={styles.container + " flex-row-space-between-center"}
      // initial="initial"
      animate={itemControls}
      exit="initial"
      variants={MOTION.searchItemVariants}
      custom={idx + 1}
      onClick={() => onClick && onClick({ ...props, beachBar, country, city, region })}
    >
      <div className={styles.itemContent + " flex-column-center-flex-start"}>
        <div className="header-6 semibold">{primary}</div>
        {secondary && <div>{secondary}</div>}
      </div>
      {beachBar && (
        <Image
          src={beachBar.thumbnailUrl}
          alt={genBarThumbnailAlt(beachBar.name)}
          className={styles.img}
          width={60}
          height={60}
          objectFit="cover"
        />
      )}
    </motion.li>
  );
};

Suggestion.displayName = "SearchFormSuggestion";
=======
import { MOTION } from "@/config/index";
import { SearchContextType } from "@/utils/contexts";
import { genBarThumbnailAlt } from "@/utils/format";
import { useSearchForm } from "@/utils/hooks";
import { AnimationControls, motion } from "framer-motion";
import Image from "next/image";
import { useMemo } from "react";
import { HANDLE_SELECT_PAYLOAD } from "../index";
import styles from "./Suggestion.module.scss";

type Props = {
  idx: number;
  itemControls: AnimationControls;
  onClick?: (info: HANDLE_SELECT_PAYLOAD) => void;
} & SearchContextType["inputValue"];

export const Suggestion: React.FC<Props> = ({
  idx,
  itemControls,
  beachBar,
  country,
  city,
  region,
  onClick,
  ...props
}) => {
  const {formatInputValue} = useSearchForm();
  const { primary, secondary } = useMemo(() => formatInputValue({ beachBar, country, city, region }), [
    beachBar,
    country,
    city,
    region,
  ]);

  return (
    <motion.li
      className={styles.container + " flex-row-space-between-center"}
      // initial="initial"
      animate={itemControls}
      exit="initial"
      variants={MOTION.searchItemVariants}
      custom={idx + 1}
      onClick={() => onClick && onClick({ ...props, beachBar, country, city, region })}
    >
      <div className={styles.itemContent + " flex-column-center-flex-start"}>
        <div className="header-6 semibold">{primary}</div>
        {secondary && <div>{secondary}</div>}
      </div>
      {beachBar && (
        <Image
          src={beachBar.thumbnailUrl}
          alt={genBarThumbnailAlt(beachBar.name)}
          className={styles.img}
          width={60}
          height={60}
          objectFit="cover"
        />
      )}
    </motion.li>
  );
};

Suggestion.displayName = "SearchFormSuggestion";
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
