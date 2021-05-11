<<<<<<< HEAD
import { NextLink } from "@/components/Next/Link";
import { LinkProps } from "next/link";
import styles from "./InfoColumn.module.scss";

type Props = {
  header: string;
  links?: { name: string; opts: LinkProps }[];
};

export const InfoColumn: React.FC<Props> = ({ header, links, children }) => {
  return (
    <div className={styles.container}>
      <div className="bold">{header}</div>
      <div>
        {links?.map(({ name, opts }, i) => (
          <NextLink key={name + "_" + i} passHref prefetch={false} className="d--block body-14" {...opts}>
            {name}
          </NextLink>
        ))}
        {children}
      </div>
    </div>
  );
};

InfoColumn.displayName = "LayoutFooterInfoColumn";
=======
import { NextLink } from "@/components/Next/Link";
import { LinkProps } from "next/link";
import styles from "./InfoColumn.module.scss";

type Props = {
  header: string;
  links?: { name: string; opts: LinkProps }[];
};

export const InfoColumn: React.FC<Props> = ({ header, links, children }) => {
  return (
    <div className={styles.container}>
      <div className="bold">{header}</div>
      <div>
        {links?.map(({ name, opts }, i) => (
          <NextLink key={name + "_" + i} passHref prefetch={false} className="d--block body-14" {...opts}>
            {name}
          </NextLink>
        ))}
        {children}
      </div>
    </div>
  );
};

InfoColumn.displayName = "LayoutFooterInfoColumn";
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
