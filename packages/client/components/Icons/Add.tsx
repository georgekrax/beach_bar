import { Base, IconBaseFProps, IconPathBaseFProps, PathBase } from "./Base";

type SubComponents = {
  Path: typeof Path;
  Circle: typeof Circle;
};

export const Path: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return <PathBase d="M3 12h18m-9 9V3" strokeLinecap="round" {...props} />;
};

export const Add: React.FC<IconBaseFProps> & SubComponents = ({ ...props }) => {
  return (
    <Base {...props}>
      <Path />
    </Base>
  );
};

export const Circle: React.FC<IconBaseFProps> = ({ ...props }) => {
  return (
    <Base {...props}>
      <circle cx={12} cy={12} r={9.25} />
      <Path d="M8.25 12h7.5M12 15.75v-7.5" />
    </Base>
  );
};

Add.displayName = "IconAdd";
Path.displayName = "IconAddPath";
Circle.displayName = "IconAddCircle";

Add.Path = Path;
Add.Circle = Circle;
