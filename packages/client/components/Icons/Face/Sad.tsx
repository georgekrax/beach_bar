import { Base, CircleBase, IconBaseFProps, IconCircleBaseFProps, IconPathBaseFProps, PathBase } from "../Base";

type SubComponents = {
  Path: typeof Path;
  Circle: typeof Circle;
  Filled: typeof Filled;
  Colored: typeof Colored;
};

const Path: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      d="M8.8 7.5A2 2 0 116 10.3m2.1 6.3c0-1.7 1.8-3 4-3c2.2 0 4 1.3 4 3m2.1-6.3A2 2 0 1115.4 7.5"
      strokeLinecap="round"
      {...props}
    />
  );
};

const Circle: React.FC<IconCircleBaseFProps> = ({ ...props }) => {
  return <CircleBase cx={12} cy={12} r={9.25} {...props} />;
};

export const Sad: React.FC<IconBaseFProps> & SubComponents = ({ ...props }) => {
  return (
    <Base {...props}>
      <Circle />
      <Path />
    </Base>
  );
};

const Filled: React.FC<IconBaseFProps> = ({ ...props }) => {
  return (
    <Base {...props}>
      <Circle filled />
      <Path className="icon__filled-path--white" />
    </Base>
  );
};

const Colored: React.FC<IconBaseFProps> = ({ ...props }) => {
  return (
    <Base {...props}>
      <Circle className="icon-stroke--error" />
      <Path className="icon-stroke--error" />
    </Base>
  );
};

Sad.displayName = "IconFaceSad";
Path.displayName = "IconFaceSadPath";
Circle.displayName = "IconFaceSadCircle";
Filled.displayName = "IconFaceSadFilled";

Sad.Path = Path;
Sad.Circle = Circle;
Sad.Filled = Filled;
Sad.Colored = Colored;

export default Sad;
