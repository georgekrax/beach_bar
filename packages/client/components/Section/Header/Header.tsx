import NextJS from "@/components/Next";
import { useClassnames } from "@hashtag-design-system/components";
import { HTMLMotionProps, motion } from "framer-motion";
import { LinkProps } from "next/link";
import styles from "./Header.module.scss";

export type Props = {
  link?: string;
};

export type FProps = Props & Pick<LinkProps, "href"> & HTMLMotionProps<"div">;

export const Header: React.FC<FProps> = ({ link = true, href, children, ...props }) => {
  const [classNames, rest] = useClassnames(styles.container + " w-100 flex-row-space-between-flex-end", props);

  return (
    <motion.div className={classNames} {...rest}>
      <h6 className="semibold">{children}</h6>
      {link && (
        <div className=" flex-row-center-center">
          <NextJS.Link href={href} >{link}</NextJS.Link>
          <svg width={12} height={12} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 12H3m18 0l-8-8m8 8l-8 8" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </motion.div>
  );
};

Header.displayName = "SectionHeader";
