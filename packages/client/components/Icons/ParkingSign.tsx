import { Base, CircleBase, IconBaseFProps, IconCircleBaseFProps, IconPathBaseFProps, PathBase } from "./Base";

type SubComponents = {
  Path: typeof Path;
  Circle: typeof Circle;
  Filled: typeof Filled;
  Colored: typeof Colored;
};

const Path: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      d="M11.2 13.3V17h-1.7V7h3.8c1.1 0 2 .3 2.6.9c.7.6 1 1.3 1 2.3c0 1-.3 1.7-1 2.3c-.6.5-1.5.8-2.7.8H11.2zm0-1.4h2.1c.6 0 1.1-.1 1.4-.4c.3-.3.5-.7.5-1.3c0-.5-.2-1-.5-1.3c-.3-.3-.8-.5-1.4-.5h-2.1v3.5z"
      filled
      {...props}
    />
  );
};

const Circle: React.FC<IconCircleBaseFProps> = ({ ...props }) => {
  return <CircleBase cx={12.5} cy={12} r={9.25} {...props} />;
};

export const ParkingSign: React.FC<IconBaseFProps> & SubComponents = ({ ...props }) => {
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
      <Path className="icon__filled--white" />
    </Base>
  );
};

const Colored: React.FC<IconBaseFProps> = ({ ...props }) => {
  return (
    <Filled className="icon__colored--parking-sign" {...props} />
  );
};

ParkingSign.displayName = "ParkingSignIcon";
Path.displayName = "ParkingSignPathIcon";
Circle.displayName = "ParkingSignCircleIcon";
Filled.displayName = "ParkingSignFilledIcon";
Colored.displayName = "ParkingSignColoredIcon";

ParkingSign.Filled = Filled;
ParkingSign.Path = Path;
ParkingSign.Circle = Circle;
ParkingSign.Colored = Colored;

export default ParkingSign;
