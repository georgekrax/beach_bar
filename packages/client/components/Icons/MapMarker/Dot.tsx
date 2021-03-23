import { Base, CircleBase, IconBaseFProps, IconCircleBaseFProps, IconPathBaseFProps, PathBase } from "../Base";

type SubComponents = {
  Filled: typeof Filled;
  Path: typeof Path;
  Circle: typeof Circle;
};

export const Path: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      d="M17.1 12.6L12 19.9L6.9 12.6C5.1 10.1 5.4 6.7 7.6 4.6C10 2.1 14 2.1 16.4 4.6C18.6 6.7 18.9 10.1 17.1 12.6Z"
      {...props}
    />
  );
};

export const Circle: React.FC<IconCircleBaseFProps> = ({ ...props }) => {
  return <CircleBase cx="12" cy="9" r="3" {...props} />;
};

export const Dot: React.FC<IconBaseFProps> & SubComponents = ({ ...props }) => {
  return (
    <Base {...props}>
      <Path />
      <Circle />
    </Base>
  );
};

export const Filled: React.FC<IconBaseFProps> = ({ ...props }) => {
  return (
    <Base {...props}>
      <Path
        filled
        d="M7.1 4.1C4.7 6.4 4.3 10.2 6.3 13L11.8 20.9C11.9 21.1 12.1 21.1 12.2 20.9L17.7 13C19.7 10.2 19.3 6.4 16.9 4.1C14.2 1.3 9.8 1.3 7.1 4.1ZM12 12C13.7 12 15 10.7 15 9C15 7.3 13.7 6 12 6C10.3 6 9 7.3 9 9C9 10.7 10.3 12 12 12Z"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </Base>
  );
};

Dot.displayName = "MapMarkerDotIcon";
Path.displayName = "MapMarkerDotPathIcon";
Circle.displayName = "MapMarkerDotCircleIcon";

Dot.Path = Path;
Dot.Filled = Filled;
Dot.Circle = Circle;
