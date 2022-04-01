import { Base, CircleBase, IconBaseFProps, IconPathBaseFProps, PathBase } from "../Base";

type SubComponents = {
  Filled: typeof Filled;
  EllipseFilled: typeof EllipseFilled;
};

export const Vector: React.FC<IconPathBaseFProps> = ({ ...props }) => (
  <PathBase
    filled
    d="M6.46 13.01a.5.5 0 00.88.48l-.88-.48zm4.15-2.12a.5.5 0 10-.23-.97l.23.97zM23 17.5a.5.5 0 000-1v1zm-22-1a.5.5 0 000 1v-1zm11-8a8.5 8.5 0 018.5 8.5h1A9.5 9.5 0 0012 7.5v1zm9 8H3v1h18v-1zM3.5 17A8.5 8.5 0 0112 8.5v-1A9.5 9.5 0 002.5 17h1zm3.84-3.51c.75-1.36 1.86-2.27 3.27-2.6l-.23-.97c-1.72.4-3.06 1.52-3.93 3.1l.88.48zM21 17.5h2v-1h-2v1zm-18-1H1v1h2v-1z"
    {...props}
  />
);

export const Circle: React.FC<IconPathBaseFProps> = ({ ...props }) => (
  <CircleBase cx={11.6} cy={6.55} r={1.3} {...props} />
);

export const FilledPath: React.FC<IconPathBaseFProps> = ({ ...props }) => (
  <PathBase filled d="M21 17a9 9 0 10-18 0h18z" {...props} />
);

export const Clochebell: React.FC<IconBaseFProps> & SubComponents = ({ ...props }) => (
  <Base {...props}>
    <Circle />
    <Vector />
  </Base>
);

export const EllipseFilled: React.FC<IconBaseFProps> = ({ ...props }) => (
  <Base {...props}>
    <Circle filled />
    <Vector />
  </Base>
);

export const Filled: React.FC<IconBaseFProps> = ({ ...props }) => (
  <Base {...props}>
    <FilledPath />
    <EllipseFilled />
  </Base>
);

Clochebell.displayName = "FoodClochebellIcon";
Filled.displayName = "FoodClochebellFilledIcon";
EllipseFilled.displayName = "FoodClochebellEllipseFilledIcon";
Vector.displayName = "FoodClochebellVectorIcon";
Circle.displayName = "FoodClochebellCircleIcon";

Clochebell.Filled = Filled;
Clochebell.EllipseFilled = EllipseFilled;
