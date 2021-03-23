import Icons from "@/components/Icons";
import dayjs from "dayjs";
import { motion, useAnimation, Variants } from "framer-motion";
import { useState } from "react";
import styles from "./Footer.module.scss";

const boxVariants: Variants = {
  open: {
    height: "auto",
    display: "block",
  },
  closed: {
    height: 0,
    display: "none",
  },
};

const iconVariants: Variants = {
  open: {
    rotate: 180,
  },
  closed: {
    rotate: 360,
  },
};

export type Props = {};

const Footer: React.FC<Props> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const controls = useAnimation();
  const iconControls = useAnimation();

  return (
    <footer
      onClick={() => {
        controls.start(!isOpen ? "open" : "closed");
        iconControls.start(!isOpen ? "open" : "closed");
        setIsOpen(prev => !prev);
      }}
      className={styles.container + " w-100"}
    >
      <Icons.Chevron.Down
        initial="closed"
        variants={iconVariants}
        animate={iconControls}
        transition={{ stiffness: 750, duration: 0.2 }}
      />
      <motion.div className={styles.box + " w-100"} variants={boxVariants} initial="closed" animate={controls}>
        <small>
          Copyright &#169; {dayjs().year()} #beach_bar. <br />
          All rights Reserved.
        </small>
      </motion.div>
    </footer>
  );
};

Footer.displayName = "Footer";

export default Footer;
