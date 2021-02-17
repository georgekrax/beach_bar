import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import { TapBarPage } from "./TabBar";

type Props = {
  id: number;
  handleClick: (e: React.MouseEvent<HTMLLIElement>, id: number) => Promise<void>;
  pathname: TapBarPage;
  children: React.ReactNode;
};

export const MenuItem = React.forwardRef<HTMLLIElement, Props>(({ id, pathname, handleClick, children }, ref) => {
  return (
    <Link href={{ pathname }}>
      <motion.li
        // Hover animation on stylesheet
        whileTap={{ scale: 0.85 }}
        ref={ref}
        onClick={async e => await handleClick(e, id)}
      >
        {children}
      </motion.li>
    </Link>
  );
});

MenuItem.displayName = "TapBarMenuItem";
