<<<<<<< HEAD
import { Base, IconBaseFProps, IconPathBaseFProps, PathBase } from "../Base";

type SubComponents = {
  Path: typeof Path;
  Filled: typeof Filled;
  Colored: typeof Colored;
};

const Path: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      d="M21 10l.5.2c.5.5.5 1.3 0 1.9L20 13.6h-2.3m3.3-3.7 1.5-1.6a1.5 1.5 0 000-2a1.2 1.2 0 00-1.8 0l-3.9 4.2a.4.4 0 01-.3.1H9m12-.8-2.7 3-.6.7m0 0H3.3c-.7 0-1.3-.6-1.3-1.4c0-.8.6-1.4 1.3-1.4h2m17.6 2.8h-9m0 0H3.1c-.6 0-1.1.5-1.1 1.1c0 .6.5.8 1.1.8h19.6c.6 0 1.1-.3 1.1-.8c0-.6-.5-1.1-1.1-1.1h-8.9zm0 0H2.9m4.2-2.8h.4M1.5 18.5h22M5.7 15.7l-.5.8A1 1 0 006.1 18h.2a2 2 0 001.4-.6l1.7-1.7H5.7zm14.8 0 .5.8A1 1 0 0120.1 18h-.2a2 2 0 01-1.4-.6l-1.7-1.7h3.7z"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    />
  );
};

export const WithMattress: React.FC<IconBaseFProps> & SubComponents = ({ ...props }) => {
  return (
    <Base {...props}>
      <Path />
    </Base>
  );
};

const Filled: React.FC<IconBaseFProps> = ({ ...props }) => {
  return (
    <Base {...props}>
      <PathBase
        className="icon__filled-path--white"
        filled
        d="M19.9 9.6a.1.1 0 000 0l-2.7 3-.6.6H2.3c-.6 0-1.1-.6-1.2-1.3c0-.7.6-1.3 1.2-1.3h13.2a.6.6 0 00.4-.2l3.9-4.2a1.1 1.1 0 011.6 0c.5.5.5 1.3 0 1.8L19.9 9.6zm.2 0-.1 0 .1 0zm-.1.2.4.1c.4.5.4 1.2 0 1.7h0l-1.5 1.6H17l.4-.5h0l0 0 2.6-2.9zm-5.3 5.5h3.1l.9.9a.6.6 0 01.1.2a.9.9 0 01-.8 1.2h-.2c-.5 0-1-.2-1.3-.6h0l0 0-1.8-1.7zm3.1-.3H2.1c-.3 0-.5-.1-.7-.2a.6.6 0 01-.3-.5c0-.5.4-.9 1-.9H21.7c.5 0 1 .4 1 .9a.6.6 0 01-.3.5c-.2.1-.4.2-.7.2h-3.8zm-13 .3h3.1L6.6 17.1c-.4.3-.8.5-1.3.5h-.2a.9.9 0 01-.8-1.3l.6-.9z"
        style={{ strokeWidth: 0.3 }}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Base>
  );
};

const Colored: React.FC<IconBaseFProps> = ({ ...props }) => {
  return (
    <Filled className="icon__colored--sunbed-with-mattress" {...props} />
  );
};

WithMattress.Path = Path;
WithMattress.Filled = Filled;
WithMattress.Colored = Colored;

WithMattress.displayName = "IconSunbedWithMattress";
Path.displayName = "IconSunbedWithMattressPath";
Filled.displayName = "IconSunbedWithMattressFilled";
Colored.displayName = "IconSunbedWithMattressColored";
=======
import { Base, IconBaseFProps, IconPathBaseFProps, PathBase } from "../Base";

type SubComponents = {
  Path: typeof Path;
  Filled: typeof Filled;
  Colored: typeof Colored;
};

const Path: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      d="M21 10l.5.2c.5.5.5 1.3 0 1.9L20 13.6h-2.3m3.3-3.7 1.5-1.6a1.5 1.5 0 000-2a1.2 1.2 0 00-1.8 0l-3.9 4.2a.4.4 0 01-.3.1H9m12-.8-2.7 3-.6.7m0 0H3.3c-.7 0-1.3-.6-1.3-1.4c0-.8.6-1.4 1.3-1.4h2m17.6 2.8h-9m0 0H3.1c-.6 0-1.1.5-1.1 1.1c0 .6.5.8 1.1.8h19.6c.6 0 1.1-.3 1.1-.8c0-.6-.5-1.1-1.1-1.1h-8.9zm0 0H2.9m4.2-2.8h.4M1.5 18.5h22M5.7 15.7l-.5.8A1 1 0 006.1 18h.2a2 2 0 001.4-.6l1.7-1.7H5.7zm14.8 0 .5.8A1 1 0 0120.1 18h-.2a2 2 0 01-1.4-.6l-1.7-1.7h3.7z"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    />
  );
};

export const WithMattress: React.FC<IconBaseFProps> & SubComponents = ({ ...props }) => {
  return (
    <Base {...props}>
      <Path />
    </Base>
  );
};

const Filled: React.FC<IconBaseFProps> = ({ ...props }) => {
  return (
    <Base {...props}>
      <PathBase
        className="icon__filled-path--white"
        filled
        d="M19.9 9.6a.1.1 0 000 0l-2.7 3-.6.6H2.3c-.6 0-1.1-.6-1.2-1.3c0-.7.6-1.3 1.2-1.3h13.2a.6.6 0 00.4-.2l3.9-4.2a1.1 1.1 0 011.6 0c.5.5.5 1.3 0 1.8L19.9 9.6zm.2 0-.1 0 .1 0zm-.1.2.4.1c.4.5.4 1.2 0 1.7h0l-1.5 1.6H17l.4-.5h0l0 0 2.6-2.9zm-5.3 5.5h3.1l.9.9a.6.6 0 01.1.2a.9.9 0 01-.8 1.2h-.2c-.5 0-1-.2-1.3-.6h0l0 0-1.8-1.7zm3.1-.3H2.1c-.3 0-.5-.1-.7-.2a.6.6 0 01-.3-.5c0-.5.4-.9 1-.9H21.7c.5 0 1 .4 1 .9a.6.6 0 01-.3.5c-.2.1-.4.2-.7.2h-3.8zm-13 .3h3.1L6.6 17.1c-.4.3-.8.5-1.3.5h-.2a.9.9 0 01-.8-1.3l.6-.9z"
        style={{ strokeWidth: 0.3 }}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Base>
  );
};

const Colored: React.FC<IconBaseFProps> = ({ ...props }) => {
  return (
    <Filled className="icon__colored--sunbed-with-mattress" {...props} />
  );
};

WithMattress.Path = Path;
WithMattress.Filled = Filled;
WithMattress.Colored = Colored;

WithMattress.displayName = "IconSunbedWithMattress";
Path.displayName = "IconSunbedWithMattressPath";
Filled.displayName = "IconSunbedWithMattressFilled";
Colored.displayName = "IconSunbedWithMattressColored";
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
