import { useClassnames } from "@hashtag-design-system/components";
import { Base, CircleBase, IconBaseFProps, IconCircleBaseFProps, IconPathBaseFProps, PathBase } from "../Base";

type CircleSubComponents = {
  Path: typeof Path;
  Circle: typeof CircleCircle;
  Filled: typeof Filled;
  Colored: typeof Colored;
};

export const Path: React.FC<IconPathBaseFProps> = ({ filled, ...props }) => {
  const [classNames, rest] = useClassnames(filled ? "icon-close__path--filled" : "", props);

  return (
    <PathBase
      d="M8.3 15.7 12 12m0 0 3.8-3.8M12 12 8.3 8.3M12 12l3.8 3.8"
      className={classNames}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    />
  );
};

export const CircleCircle: React.FC<IconCircleBaseFProps> = ({ ...props }) => {
  return <CircleBase cx={12} cy={12} r={9.25} {...props} />;
};

export const Circle: React.FC<IconBaseFProps> & CircleSubComponents = ({ ...props }) => {
  return (
    <Base {...props}>
      <CircleCircle />
      <Path />
    </Base>
  );
};

export const Filled: React.FC<IconBaseFProps> = ({ ...props }) => {
  return (
    <Base {...props}>
      <CircleCircle filled />
      <Path filled />
    </Base>
  );
};

export const Colored: React.FC<IconBaseFProps> = ({ ...props }) => {
  return (
    <Base {...props}>
      <CircleCircle filled className="icon-close__circle--colored" />
      <Path filled />
    </Base>
  );
};

Circle.displayName = "IconCloseCircle";
Path.displayName = "IconCloseCirclePath";
CircleCircle.displayName = "IconCloseCircleCircle";
Filled.displayName = "IconCloseCircleFilled";
Colored.displayName = "IconCloseCircleColored";

Circle.Path = Path;
Circle.Circle = CircleCircle;
Circle.Filled = Filled;
Circle.Colored = Colored;
