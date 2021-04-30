import Icons from "@/components/Icons";
import { IconBox } from "@/components/Next/IconBox";
import { MOTION } from "@/config/index";
import { motion } from "framer-motion";
import { SearchFormProps } from "./index";
import styles from "./ReturnAndClear.module.scss";

type Props = {
  onClear: () => void;
} & Pick<SearchFormProps, "handleReturn">;

export const ReturnAndClear: React.FC<Props> = ({ handleReturn, onClear }) => (
  <div className={styles.container + " flex-row-space-between-center"}>
    <IconBox
      initial="initial"
      animate="animate"
      variants={MOTION.bounceAnimation}
      aria-label="Return to homepage"
      onClick={() => handleReturn()}
    >
      <Icons.Close />
    </IconBox>
    <motion.div
      className="header-6"
      initial="initial"
      animate="animate"
      variants={MOTION.bounceAnimation}
      aria-label="Clear search input"
      onClick={() => onClear()}
    >
      Clear
    </motion.div>
  </div>
);

ReturnAndClear.displayName = "SearchFormReturnAndClear";
