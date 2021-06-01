import { Base, IconBaseFProps, IconPathBaseFProps, PathBase } from "../Base";
import { Circle } from "./Circle";

type SubComponents = {
  Path: typeof Path;
  Circle: typeof Circle;
};

export const Path: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return <PathBase d="M3 20.8L11.9 12M11.9 12L21 3M11.9 12L3 3.2M11.9 12L21 21" strokeLinecap="round" {...props} />;
};

export const Close: React.FC<IconBaseFProps> & SubComponents = ({ ...props }) => {
  return (
    <Base {...props}>
      <Path />
    </Base>
  );
};


Close.displayName = "IconClose";
Path.displayName = "IconClosePath";

Close.Path = Path;
Close.Circle = Circle;

export default Close;
