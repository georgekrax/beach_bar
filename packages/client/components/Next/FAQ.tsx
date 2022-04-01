import Icons from "@/components/Icons";
import { motion, Variants } from "framer-motion";
import { useState } from "react";
import styles from "./FAQ.module.scss";

const boxVariants: Variants = {
  open: { height: "auto" },
  closed: { height: 0 },
};

const iconVariants: Variants = { open: { rotate: 180 }, closed: { rotate: 360 } };

type Props = {
  question: string;
};

export const FAQ: React.FC<Props> = ({ question }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={styles.container}>
      <div
        className={
          styles.question +
          (isExpanded ? ` ${styles.active} itext--primary` : "") +
          " semibold cursor--pointer flex-row-space-between-center"
        }
        onClick={() => setIsExpanded(prev => !prev)}
      >
        <div>{question}</div>
        <div className={styles.icon + " flex-row-center-center border-radius--lg"}>
          <Icons.Chevron.Down
            width={16}
            height={16}
            initial="closed"
            variants={iconVariants}
            animate={isExpanded ? "open" : "closed"}
            transition={{ stiffness: 750, duration: 0.2 }}
          />
        </div>
      </div>
      <motion.div className={styles.answer} animate={isExpanded ? "open" : "closed"} variants={boxVariants}>
        <div className="text--grey">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempora modi, sed omnis facilis repellendus corrupti
          repudiandae illo consequuntur provident odio.
        </div>
      </motion.div>
    </div>
  );
};

FAQ.displayName = "NextFAQ";
