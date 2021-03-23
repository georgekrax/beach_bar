import Icons from "@/components/Icons";
import Next from "@/components/Next";
import { MOTION } from "@/config/index";
import { motion } from "framer-motion";
import { SearchFormProps } from "./index";
import styles from "./ReturnAndClear.module.scss";

type Props = {
  onClear: () => void;
} & Pick<SearchFormProps, "onReturn">;

export const ReturnAndClear: React.FC<Props> = ({ onReturn, onClear }) => {
  return (
    <div className={styles.container + " flex-row-space-between-center"}>
      <Next.IconBox initial="initial" animate="animate" variants={MOTION.bounceAnimation} onClick={() => onReturn()}>
        <Icons.Close />
      </Next.IconBox>
      <motion.div
        className="header-6"
        initial="initial"
        animate="animate"
        variants={MOTION.bounceAnimation}
        onClick={() => onClear()}
      >
        Clear
      </motion.div>
    </div>
  );
};

ReturnAndClear.displayName = "SearchFormReturnAndClear";
