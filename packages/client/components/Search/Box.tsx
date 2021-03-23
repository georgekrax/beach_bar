import Icons from "@/components/Icons";
import { MOTION, NAMES } from "@/config/index";
import { Input, InputFProps, useClassnames } from "@hashtag-design-system/components";
import { HTMLMotionProps, motion } from "framer-motion";
import { useRouter } from "next/router";
import { memo, useEffect } from "react";
import styles from "./Box.module.scss";

type Props = {
  redirectUri?: string;
  input?: InputFProps;
};

type FProps = Props & HTMLMotionProps<"div">;

export const Box: React.FC<FProps> = memo(({ redirectUri, input, onClick, ...props }) => {
  const [classNames, rest] = useClassnames(
    styles.container + " w-100 zi--md border-radius--lg flex-column-flex-start-stretch",
    props
  );
  const router = useRouter();

  const handleTransform = (generated: string) => {
    if (generated.includes("scale(1,")) return generated.split(" scale(1, ")[0];
    else return generated;
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    let query = { box: true };
    if (redirectUri) Object.assign(query, { redirect: redirectUri });
    router.push({ pathname: "/search", query });
    if (onClick) onClick(e);
  };

  useEffect(() => {
    router.prefetch("/search?box=true");
  }, []);

  return (
    <motion.div
      className={classNames}
      initial={false}
      layout
      layoutId={MOTION.LAYOUT_IDS.searchBox}
      transformTemplate={(_, generated) => handleTransform(generated)}
      onClick={e => handleClick(e)}
      {...rest}
    >
      <Input
        prefix={<Icons.Search />}
        floatingplaceholder={false}
        placeholder={NAMES.SEARCH_BOX_PLACEHOLDER}
        {...input}
      />
    </motion.div>
  );
});

Box.displayName = "SearchBox";
