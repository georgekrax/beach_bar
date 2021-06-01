import { useClassnames } from "@hashtag-design-system/components";

export type Props = {
  semibold?: boolean;
};

export type FProps = Props & React.ComponentPropsWithoutRef<"span">;

export const Error: React.FC<FProps> = ({ semibold = false, children, ...props }) => {
  const [classNames, rest] = useClassnames(`feedback error${semibold ? " semibold" : ""}`, props);

  return (
    <span className={classNames} {...rest}>
      {children}
    </span>
  );
};

Error.displayName = "FeedbackError";
