import { cx, Link as ChakraLink, LinkProps as ChakraLinkProps } from "@hashtag-design-system/components";
import NextJSLink, { LinkProps } from "next/link";
import { forwardRef } from "react";

// export type Props = LinkProps &
//   Pick<ChakraLinkProps, "className" | "onClick"> & {
//     a?: boolean | ChakraLinkProps;
//     children?: React.ReactNode;
//     newTab?: boolean;
//   };
export type Props = ({ isA?: false } | { isA?: true; newTab?: boolean; link: LinkProps }) &
  ChakraLinkProps & {
    children?: React.ReactNode;
  };

export const Link = forwardRef<HTMLAnchorElement, Props>(({ children, ..._props }, ref) => {
  const { link = {}, isA = !!(_props as any).link, newTab = false, ...props } = (_props as any);
  const _className = cx("link", props.className);

  return isA ? (
    <NextJSLink passHref {...link}>
      <ChakraLink target={newTab ? "_blank" : undefined} {...props} ref={ref} className={_className}>
        {children}
      </ChakraLink>
    </NextJSLink>
  ) : (
    <ChakraLink as="span" {...props} ref={ref} className={_className}>
      {children}
    </ChakraLink>
  );
});

Link.displayName = "NextLink";

export const NextLink = Link;
