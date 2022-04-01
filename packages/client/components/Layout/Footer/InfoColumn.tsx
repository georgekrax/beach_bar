import Next from "@/components/Next";
import { LinkProps } from "next/link";
import styles from "./InfoColumn.module.scss";

type Props = {
  header: string;
  links?: { name: string; opts: LinkProps }[];
};

export const InfoColumn: React.FC<Props> = ({ header, links, children }) => {
  return (
    <div className={styles.container + " body-14"}>
      <div className="bold upper">{header}</div>
      <div>
        {links?.map(({ name, opts }, i) => (
          <Next.Link key={name + "_" + i} display="block" link={{ prefetch: false, ...opts }}>
            {name}
          </Next.Link>
        ))}
        {children}
      </div>
    </div>
  );
};

InfoColumn.displayName = "LayoutFooterInfoColumn";
