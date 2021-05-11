import { motion } from "framer-motion";
import React from "react";

type Props = {
  id: number;
  handleClick: (e: React.MouseEvent<HTMLLIElement>, id: number) => Promise<void>;
  children: React.ReactNode;
};

export const MenuItem = React.memo(
  React.forwardRef<HTMLLIElement, Props>(({ id, handleClick, children }, ref) => {
    return (
      // If the <Link /> component was used, the animation would lag
      // <Link href={{ pathname }}>
      <motion.li
        // Hover animation on stylesheet
        whileTap={{ scale: 0.85 }}
        ref={ref}
        onClick={async e => await handleClick(e, id)}
      >
        {children}
      </motion.li>
      // </Link>
    );
  })
);

MenuItem.displayName = "TapBarMenuItem";
