import { Base, IconBaseFProps, IconPathBaseFProps, PathBase } from "../Base";
import { WithMattress } from "./WithMattress";

type SubComponents = {
  Path: typeof Path;
  Filled: typeof Filled;
  Colored: typeof Colored;
  WithMattress: typeof WithMattress;
};

const Path: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      d="M18.6 13.6l4.9-5a5.6 5.6 0 00-1.5-.5c-.8-.4-1.6.2-2 .5l-2 2c-.8.8-1.3 1-1.5 1H9.3m9.3 2c-.3.2-1.2.5-2 .5m2-.5.8 1.7a.9.9 0 01-.8 1.3v0a.9.9 0 01-.8-.4l-1.2-2.1m0 0H7.4m0-2.5H5.9c-2 0-2.1 1.7-2 2.5h1.5m2 0-1.7 2.2a.8.8 0 01-.6.3v0a.8.8 0 01-.6-1.2l1-1.3m2 0H5.4m17.1 3H1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    />
  );
};

export const Sunbed: React.FC<IconBaseFProps> & SubComponents = ({ ...props }) => {
  return (
    <Base {...props}>
      <Path />
    </Base>
  );
};

const Colored: React.FC<IconBaseFProps> = ({ ...props }) => {
  return (
    <Sunbed className="icon__colored--sunbed" {...props} />
  );
};

const Filled: React.FC<IconBaseFProps> = ({ ...props }) => {
  return (
    <Base {...props}>
      <PathBase
        filled
        d="M23.5 8.6l-4.9 5 .7 1 .3.7a1 1 0 01-1.8.8l-1.2-2h-9.3l-1.7 2.2a.8.8 0 11-1.2-.9l1-1.3H3.9c-.2-.8 0-2.5 2-2.5h10.8c.2 0 .7-.2 1.5-1l2-2c.3-.3 1.2-.9 2-.5a5.6 5.6 0 011.5.5z"
      />
      <Path d="M18.6 13.6l4.9-5a5.6 5.6 0 00-1.5-.5c-.8-.4-1.6.2-2 .5l-2 2c-.8.8-1.3 1-1.5 1H5.9c-2 0-2.1 1.7-2 2.5h1.5m13.2-.5c-.3.2-1.2.5-2 .5m2-.5.7 1 .3.7a1 1 0 01-.9 1.3v0a1 1 0 01-.8-.5l-1.2-2m0 0h-9.3m0 0-1.7 2.2a.8.8 0 01-.6.3v0a.8.8 0 01-.6-1.2l1-1.3m2 0H5.4m17.1 3H1.5" />
    </Base>
  );
};

Sunbed.Path = Path;
Sunbed.Filled = Filled;
Sunbed.Colored = Colored;
Sunbed.WithMattress = WithMattress;

Sunbed.displayName = "IconSunbed";
Path.displayName = "IconSunbedPath";
Filled.displayName = "IconSunbedFilled";
