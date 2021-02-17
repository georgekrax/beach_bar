import { useClassnames } from "@hashtag-design-system/components";
import Link from "next/link";
import styles from "./PageHeader.module.scss";

export type Props = {
  header: string;
  link?: string;
};

export type FProps = Props & React.ComponentPropsWithoutRef<"div">;

const PageHeader: React.FC<FProps> = ({ header, link, ...props }) => {
  const [classNames, rest] = useClassnames(styles.container + " w-100 flex-row-space-between-flex-end", props);

  return (
    <div className={classNames} {...rest}>
      <h6>{header}</h6>
      {link && (
        <div className=" flex-row-center-center">
          {/* TODO: Change pathname */}
          <Link href={{ pathname: "/map" }}>{link}</Link>
          <svg width={12} height={12} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 12H3m18 0l-8-8m8 8l-8 8" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </div>
  );
};

PageHeader.displayName = "SectionPageHeader";

export default PageHeader;
