import { cx, Box, BoxProps } from "@hashtag-design-system/components";
import styles from "./Details.module.scss";

type Props = BoxProps & {
  header?: string;
};

export const Details: React.FC<Props> = ({ header, children, ...props }) => {
  const _className = cx(styles.container + " w100", props.className);

  return (
    <Box {...props} className={_className}>
      {header && <h5 className="upper normal body-16">{header}</h5>}
      {children}
    </Box>
  );
};

Details.displayName = "AccountTripsDetails";
