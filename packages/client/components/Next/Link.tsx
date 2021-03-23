import { useClassnames } from "@hashtag-design-system/components";
import NextLink, { LinkProps } from "next/link";

type Props = {
  as?: "a";
};

type FProps = Props & LinkProps;

export const Link: React.FC<FProps> = ({ as = "a", children,...props }) => {
  const [classNames, rest] = useClassnames("link", props);

  return <NextLink {...rest}>{as === "a" ? <a className={classNames}>{children}</a> : children}</NextLink>;
};

Link.displayName = "NextLink";
