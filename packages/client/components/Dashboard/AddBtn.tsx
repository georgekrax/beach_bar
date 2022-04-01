import Icons from "@/components/Icons";
import Next, { NextLinkProps, NextUploadBtnProps } from "@/components/Next";
import { Button, ButtonProps } from "@hashtag-design-system/components";
import styles from "./AddBtn.module.scss";

export type Props = {
  heading?: string;
  isUpload?: boolean;
  btnText?: string;
  showIcon?: boolean;
} & Pick<NextUploadBtnProps, "onChange"> &
  Pick<Partial<NextLinkProps>, "href" | "a"> &
  Pick<ButtonProps, "onClick">;

export const AddBtn: React.FC<Props> = ({
  a,
  href,
  heading,
  btnText = "Add",
  showIcon = true,
  isUpload = false,
  onClick,
  onChange,
}) => {
  const icon = showIcon ? <Icons.Add className="icon--bold icon__stroke--white" width={14} height={14} /> : null;

  return (
    <div className={styles.container + " flex-row-space-between-center"}>
      <h4 className={styles.header}>{heading}</h4>
      {isUpload ? (
        <Next.UploadBtn variant="primary" onChange={onChange}>
          {icon}
          <span>Add</span>
        </Next.UploadBtn>
      ) : (
        <Next.Link isA={!!href} link={{ href: href || "" }} {...a}>
          <Button variant="primary" className="body-14" onClick={onClick}>
            {icon}
            <span>{btnText}</span>
          </Button>
        </Next.Link>
      )}
    </div>
  );
};

AddBtn.displayName = "DashboardAddBtn";
