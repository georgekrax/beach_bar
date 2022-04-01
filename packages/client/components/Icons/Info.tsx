import { Base, CircleBase, IconBaseFProps, IconPathBaseFProps, PathBase } from "./Base";

type SubComponents = {
  Filled: typeof Filled;
};

const Circle: React.FC<IconPathBaseFProps> = props => <CircleBase cx={12.25} cy={8} r={1} {...props} />;

const Path1: React.FC<IconPathBaseFProps> = props => (
  <PathBase d="M21.5 12.5a9.5 9.5 0 11-19 0a9.5 9.5 0 0119 0z" {...props} />
);

const Path2: React.FC<IconPathBaseFProps> = props => (
  <PathBase
    className="icon__stroke--none icon__filled--black"
    d="M13 11.3a.8.8 0 00-1.5 0H13zm-1.5 6a.8.8 0 001.5 0h-1.5zm0-6v6H13v-6h-1.5z"
    {...props}
  />
);

export const Info: React.FC<IconBaseFProps> & SubComponents = props => (
  <Base {...props}>
    <Path1 />
    <Path2 />
    <Circle className="icon__stroke--none icon__filled--black" />
  </Base>
);

const Filled: React.FC<IconBaseFProps> = props => (
  <Base {...props}>
    <Path1 className="icon__stroke--none icon__filled--black" />
    <Path2 className="icon__stroke--none icon__filled--white" />
    <Circle className="icon__stroke--none icon__filled--white" />
  </Base>
);

Info.displayName = "InfoIcon";
Filled.displayName = "InfoFilledIcon";
Path1.displayName = "InfoPath1Icon";
Path2.displayName = "InfoPath2Icon";
Circle.displayName = "InfoCircleIcon";

Info.Filled = Filled;
