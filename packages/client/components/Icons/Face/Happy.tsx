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
      d="M6 10.5a2 2 0 114 0m-2 4c0 1.7 1.8 3 4 3s4-1.3 4-3m-2-4a2 2 0 114 0"
      strokeLinecap="round"
      {...props}
    />
  );
};

const Circle: React.FC<IconCircleBaseFProps> = ({ ...props }) => {
  return <CircleBase cx={12} cy={12} r={9.25} {...props} />;
};

export const Happy: React.FC<IconBaseFProps> & SubComponents = ({ ...props }) => {
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
      <Circle className="icon-stroke--success" />
      <Path className="icon-stroke--success" />
    </Base>
  );
};

Happy.displayName = "IconFaceHappy";
Path.displayName = "IconFaceHappyPath";
Circle.displayName = "IconFaceHappyCircle";
Filled.displayName = "IconFaceHappyFilled";

Happy.Path = Path;
Happy.Circle = Circle;
Happy.Filled = Filled;
Happy.Colored = Colored;

export default Happy;
