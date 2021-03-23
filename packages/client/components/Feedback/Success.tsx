import { useClassnames } from "@hashtag-design-system/components";
import { FeedbackErrorFProps } from "./index";

type FProps = FeedbackErrorFProps;

export const Success: React.FC<FProps> = ({ semibold = false, children, ...props }) => {
  const [classNames, rest] = useClassnames(`feedback success${semibold ? " semibold" : ""}`, props);

  return (
    <span className={classNames} {...rest}>
      {children}
    </span>
  );
};

Success.displayName = "FeedbackSuccess";
