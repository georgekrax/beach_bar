import { useClassnames } from "@hashtag-design-system/components";
import NextJSLink, { LinkProps } from "next/link";

type Props = {
  a?: boolean;
};

export const Link: React.FC<Props & LinkProps & Pick<React.ComponentPropsWithoutRef<"a">, "className">> = ({
  a = true,
  children,
  ...props
}) => {
  const [classNames, rest] = useClassnames("link", props);

  return (
    <NextJSLink passHref {...rest}>
      {a ? <a className={classNames}>{children}</a> : children}
    </NextJSLink>
  );
};

Link.displayName = "NextLink";

export const NextLink = Link;