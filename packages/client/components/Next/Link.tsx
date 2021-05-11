<<<<<<< HEAD
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

=======
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

>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
export const NextLink = Link;