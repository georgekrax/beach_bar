import Icons from "@/components/Icons";
import { useClassnames } from "@hashtag-design-system/components";
import styles from "./Feedback.module.scss";

type Props = {
  isShown?: boolean;
  positive?: boolean;
};

type FProps = Props & Pick<React.ComponentPropsWithoutRef<"div">, "className">;

export const Feedback: React.FC<FProps> = ({ isShown, positive = false, children, ...props }) => {
  const [classNames, rest] = useClassnames(styles.container + " flex-row-flex-start-center", props);

  return isShown ? (
    <div className={classNames} {...rest}>
      {positive ? (
        <Icons.Face.Happy.Colored width={40} height={40} />
      ) : (
        <Icons.Face.Sad className={styles.negative} width={40} height={40} />
      )}
      {children}
    </div>
  ) : null;
};

Feedback.displayName = "BeachBarReviewFeedback";
