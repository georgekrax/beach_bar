import { Base, IconBaseFProps, IconPathBaseFProps, PathBase } from "./Base";

type SubComponents = {
  Filled: typeof Filled;
  HalfFilled: typeof HalfFilled;
};

export const Vector: React.FC<IconPathBaseFProps> = props => (
  <PathBase
    filled
    d="M20.5 7.8a.5.5 0 00-1 0h1zm-15 0a.5.5 0 00-1 0h1zm10 2.4a.5.5 0 00-1 0h1zm-1 7.8a.5.5 0 101 0h-1zm-4-7.8a.5.5 0 00-1 0h1zm-1 7.8a.5.5 0 001 0h-1zM5 3.9a.5.5 0 100 1v-1zm15 1a.5.5 0 000-1v1zM9.2 2.5V2a.5.5 0 00-.5.5h.5zm6.6 0h.5a.5.5 0 00-.5-.5v.5zM19.5 7.8v9.8h1v-9.8h-1zM16.7 21H8.3v1h8.3v-1zM5.5 17.6V7.8h-1v9.8h1zM8.3 21C6.8 21 5.5 19.6 5.5 17.6h-1C4.5 19.9 6.1 22 8.3 22v-1zM19.5 17.6C19.5 19.6 18.2 21 16.7 21v1c2.2 0 3.8-2.1 3.8-4.4h-1zm-5-7.3v7.8h1v-7.8h-1zm-5 0v7.8h1v-7.8h-1zM5 4.9h4.2v-1H5v1zm3.7-1.4v.9h1v-.9h-1zm.5 1.4h6.6v-1H9.2v1zm6.6 0H20v-1h-4.2v1zm-.5-1.4v.9h1v-.9h-1zM9.2 3h6.6V2H9.2v1zm.5.5V2.5h-1v1h1zM15.3 2.5v1h1V2.5h-1z"
    {...props}
  />
);

export const Bars: React.FC<IconPathBaseFProps> = props => (
  <PathBase
    d="M15 10.3a.5.5 0 00-1 0h1zm-1 7.8a.5.5 0 101 0h-1zm-4-7.8a.5.5 0 00-1 0h1zm-1 7.8a.5.5 0 001 0H9zm5-7.8v7.8h1v-7.8h-1zm-5 0v7.8h1v-7.8H9z"
    {...props}
  />
);

export const HandleBar: React.FC<IconPathBaseFProps> = props => <PathBase d="M8.7 4.4V2.5h6.6V4.4H8.7z" {...props} />;

export const Bin: React.FC<IconPathBaseFProps> = props => (
  <PathBase d="M19.5 17.6V7.8h-15v9.8c0 2.2 1.5 3.9 3.3 3.9h8.3c1.8 0 3.3-1.8 3.3-3.9z" {...props} />
);

export const TrashBin: React.FC<IconBaseFProps> & SubComponents = props => (
  <Base {...props}>
    <Vector />
  </Base>
);

export const Filled: React.FC<IconBaseFProps> = props => (
  <Base {...props}>
    <Bin className="icon__filled--black" />
    <HalfFilled />
    <Vector d="M20 7.8a.5.5 0 00-1 0h1zm-15 0a.5.5 0 00-1 0h1zm10 2.4a.5.5 0 00-1 0h1zm-1 7.8a.5.5 0 101 0h-1zm-4-7.8a.5.5 0 10-1 0h1zm-1 7.8a.5.5 0 001 0H9zM4.5 3.9a.5.5 0 100 1v-1zm15 1a.5.5 0 000-1v1zM8.7 2.5V2a.5.5 0 00-.5.5h.5zm6.6 0h.5a.5.5 0 00-.5-.5v.5zM19 7.8v9.8h1v-9.8h-1zM16.2 21H7.8v1h8.3v-1zM5 17.6V7.8H4v9.8h1zM7.8 21C6.3 21 5 19.6 5 17.6H4C4 19.9 5.6 22 7.8 22v-1zM19 17.6C19 19.6 17.7 21 16.2 21v1C18.4 22 20 19.9 20 17.6h-1zm-5-7.3v7.8h1v-7.8h-1zm-5 0v7.8h1v-7.8H9zM4.5 4.9h4.2v-1H4.5v1zm3.7-1.4v.9h1v-.9h-1zm.5 1.4h6.6v-1H8.7v1zm6.6 0H19.5v-1h-4.2v1zm-.5-1.4v.9h1v-.9h-1zM8.7 3h6.6V2H8.7v1zm.5.5V2.5h-1v1h1zM14.8 2.5v1h1V2.5h-1z" />
    {/* <HandleBar filled /> */}
    <Bars className="icon__filled--white icon__stroke--none" />
  </Base>
);

export const HalfFilled: React.FC<IconBaseFProps> = ({ ...props }) => (
  <Base {...props}>
    <Vector />
    <HandleBar filled />
  </Base>
);

TrashBin.displayName = "TrashBinIcon";
Filled.displayName = "TrashBinFilledIcon";
HalfFilled.displayName = "TrashBinHalfFilledIcon";
Vector.displayName = "TrashBinVectorIcon";
Bars.displayName = "TrashBinBarsIcon";
HandleBar.displayName = "TrashBinHandleBarIcon";
Bin.displayName = "TrashBinBinIcon";

TrashBin.Filled = Filled;
TrashBin.HalfFilled = HalfFilled;
