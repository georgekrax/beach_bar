import { BottomSheet, BottomSheetFProps, Button, ButtonFProps, useClassnames } from "@hashtag-design-system/components";
import Icons from "@/components/Icons";
import styles from "./Crud.module.scss";
import { Btn } from "./Btn";

type SubComponents = {
  Btn: typeof Btn;
}

type Props = {
  title?: string;
  cta?:
    | false
    | (Omit<ButtonFProps, "onClick"> & {
        icon?: React.ReactNode;
        onClick?:
          | ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>, dismiss: () => Promise<void>) => Promise<void>)
          | undefined;
      });
  bottomSheet?: BottomSheetFProps;
  content?: React.ComponentPropsWithoutRef<"div">;
  closeIcon?: "close" | "chevron_left";
  onClose?: (event: React.MouseEvent<"svg", MouseEvent>) => void;
};

export const Crud: React.FC<Props> & SubComponents = ({ cta, bottomSheet, children, onClose, ...props }) => {
  return bottomSheet ? (
    <BottomSheet {...bottomSheet}>
      {({ dismiss }) => (
        <Content
          onClose={async e => {
            await dismiss();
            if (onClose) onClose(e);
          }}
          cta={{
            ...cta,
            onClick: async e => {
              if (cta) cta.onClick && (await cta.onClick(e, dismiss));
            },
          }}
          {...props}
        >
          {children}
        </Content>
      )}
    </BottomSheet>
  ) : (
    <Content cta={cta} onClose={onClose} {...props}>{children}</Content>
  );
};

Crud.Btn = Btn;

Crud.displayName = "HeaderCrud";

export const Content: React.FC<Props> = ({ title, cta, content, closeIcon, children, onClose }) => {
  const [ctaClassNames, ctaRest] = useClassnames("upper", !cta ? {} : cta);
  const [contentClassNames, contentRest] = useClassnames(
    styles.content + " " + styles.container__padding,
    content || {}
  );

  return (
    <div>
      <div className={styles.container + " flex-row-flex-start-center " + styles.container__padding}>
        {closeIcon === "close" ? (
          <Icons.Close className="icon--bold" width={20} height={20} onClick={onClose} />
        ) : (
          <Icons.Arrow.Left className="icon--bold" width={20} height={20} onClick={onClose} />
        )}
        <div className="border-radius--lg" />
        <h6 className="semibold">{title}</h6>
        {cta && (
          <Button className={ctaClassNames} {...ctaRest}>
            {cta.icon || <Icons.Save />} {cta?.children}
          </Button>
        )}
      </div>
      <div className={contentClassNames} {...contentRest}>
        <div>{children}</div>
      </div>
    </div>
  );
};

Content.displayName = "HeaderCrudContent";
