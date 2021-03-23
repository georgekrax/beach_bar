import { useClassnames, Button, ButtonFProps } from "@hashtag-design-system/components";
import styles from "./TimePicker.module.scss";

type Props = {
  arr: string[];
  slice?: boolean;
  btn?: ButtonFProps;
}

type FProps = Props &  React.ComponentPropsWithoutRef<"div">;

export const TimePicker: React.FC<FProps> = ({ arr, slice = false, btn, children, ...props }) => {
  const [classNames, rest] = useClassnames(styles.container + " flex-row-center-center", props);

  return (
    <div className={classNames} {...rest}>
      {arr.map(hour => (
        <Button key={hour} variant="secondary" {...btn}>
          {slice ? hour.slice(0, -3) : hour}
        </Button>
      ))}
    </div>
  );
};

TimePicker.displayName = "NextTimePicker";
