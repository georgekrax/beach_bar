import { useClassnames } from "@hashtag-design-system/components";
import { Base, CircleBase, IconBaseFProps, IconCircleBaseFProps, IconPathBaseFProps, PathBase } from "./Base";

type SubComponents = {
  Path: typeof Path;
  Circle: typeof Circle;
};

export const Path: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return <PathBase d="M3.5 12.3l6.1 6.3L22.3 5" strokeLinecap="round" strokeLinejoin="round" {...props} />;
};
export const Checkmark: React.FC<IconBaseFProps> & SubComponents = ({ ...props }) => {
  return (
    <Base {...props}>
      <Path />
    </Base>
  );
};

type CircleSubComponents = {
  Path: typeof CirclePath;
  Circle: typeof CircleCircle;
  Filled: typeof CircleFilled;
  Colored: typeof CircleColored;
};

export const CirclePath: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  const [classNames, rest] = useClassnames("icon-chechmark__path--filled", props);

  return (
    <PathBase
      d="M8.25 12.112l2.535 2.612 5.307-5.64"
      className={classNames}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    />
  );
};

export const CircleCircle: React.FC<IconCircleBaseFProps> = ({ ...props }) => {
  return <CircleBase cx={12} cy={12} r={9.5} {...props} />;
};

export const Circle: React.FC<IconBaseFProps> & CircleSubComponents = ({ ...props }) => {
  return (
    <Base {...props}>
      <CircleCircle />
      <CirclePath />
    </Base>
  );
};

export const CircleFilled: React.FC<IconBaseFProps> = ({ ...props }) => {
  return (
    <Base {...props}>
      <CircleCircle filled />
      <CirclePath />
    </Base>
  );
};

export const CircleColored: React.FC<IconBaseFProps> = ({ ...props }) => {
  return (
    <Base {...props}>
      <CircleCircle filled className="icon-chechmark__circle--colored" />
      <CirclePath />
    </Base>
  );
};

Checkmark.displayName = "IconCheckmark";
Path.displayName = "IconCheckmarkPath";
Circle.displayName = "IconCheckmarkCircle";

Checkmark.Path = Path;
Checkmark.Circle = Circle;
Circle.Path = CirclePath;
Circle.Circle = CircleCircle;
Circle.Filled = CircleFilled;
Circle.Colored = CircleColored;
