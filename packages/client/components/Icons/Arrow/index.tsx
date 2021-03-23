import { Base, IconBaseFProps, IconPathBaseFProps, PathBase } from "../Base";
import { Down } from "./Down";
import { Left } from "./Left";
import { Right } from "./Right";

type SubComponents = {
  Left: typeof Left;
  Right: typeof Right;
  Down: typeof Down;
  Path: typeof Path;
};

export const Path: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return <PathBase d="M12 21V3m0 18l-8-8m8 8l8-8" strokeLinecap="round" strokeLinejoin="round" {...props} />;
};

export const Arrow: React.FC<IconBaseFProps> & SubComponents = ({ ...props }) => {
  return (
    <Base {...props}>
      <Path />
    </Base>
  );
};

Arrow.Left = Left;
Arrow.Right = Right;
Arrow.Down = Down;
Arrow.Path = Path;

Arrow.displayName = "IconArrowUp";
Path.displayName = "IconArrowUpPath";
