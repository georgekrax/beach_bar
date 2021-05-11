import { Base, IconBaseFProps, IconPathBaseFProps, PathBase } from "./Base";

type SubComponents = {
  Path: typeof Path;
  Filled: typeof Filled;
};

export const Path: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      d="M10.4 4.3c.9-1.3 2.2-2.1 3.1-2.4c.1 3.5 1.9 5.4 3.4 7l.2.3C18.7 10.8 20 12.1 20 14.8c0 4.4-3.4 7.5-7.8 7.5c-4.5 0-8.2-3.2-8.2-7.5c0-1.7.8-3.3 1.9-4.1c.5 1.2 1.2 2 1.9 2.3c.9.4 1.6.1 2.1-.4c.7-.7.7-1.9.1-2.9c-1.1-2.1-.7-3.9.3-5.3z"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    />
  );
};

export const Flame: React.FC<IconBaseFProps> & SubComponents = ({ ...props }) => {
  return (
    <Base {...props}>
      <Path />
    </Base>
  );
};

export const Filled: React.FC<IconBaseFProps> = ({ ...props }) => {
  return (
    <Base {...props}>
      <Path filled />
    </Base>
  );
};

Flame.displayName = "FlameIcon";
Path.displayName = "FlamePathIcon";

Flame.Path = Path;
Flame.Filled = Filled;
