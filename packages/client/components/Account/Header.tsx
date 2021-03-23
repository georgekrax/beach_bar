import Search from "@/components/Search";
import { useAuth } from "@/utils/hooks";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "./Header.module.scss";

export const Header: React.FC = () => {
  const router = useRouter();
  const { data } = useAuth();

  return (
    <motion.div className="w-100 flex-row-space-between-center" layout layoutId="hey">
      <div className={styles.inputContainer}>
        <Search.Box redirectUri={router.pathname} />
      </div>
      <Image
        className={styles.avatar}
        src={data?.me?.account.imgUrl || "/user_default.jpg"}
        width={60}
        height={60}
        objectFit="cover"
        objectPosition="center"
        quality={100}
      />
    </motion.div>
  );
};

Header.displayName = "AccountHeader";
