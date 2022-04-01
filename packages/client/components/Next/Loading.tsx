import { Animated } from "@hashtag-design-system/components";
import styles from "./Loading.module.scss";

type Props = {
  isLoading?: boolean;
  isScreen?: boolean;
};

export const Loading: React.FC<Props> = ({ isLoading, isScreen, children }) => {
  return isLoading ? (
    <div className={styles.spinner + (isScreen ? " " + styles.screen : "") +" w100 h100 flex-row-center-center"}>
      <Animated.Loading.Spinner />
    </div>
  ) : (
    <>{children}</>
  );
};

Loading.displayName = "NextLoading";
