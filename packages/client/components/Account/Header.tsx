import Search from "@/components/Search";
import {MOTION } from "@/config/index";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import styles from "./Header.module.scss";
import Account from "./index";

export const Header: React.FC = () => {
  const router = useRouter();

  return (
    <motion.div className="w100 flex-row-space-between-center" layout layoutId={MOTION.LAYOUT_IDS.accountHeader}>
      <div className={styles.inputContainer}>
        <Search.Box redirectUri={router.pathname} />
      </div>
      <Account.Avatar />
    </motion.div>
  );
};

Header.displayName = "AccountHeader";
