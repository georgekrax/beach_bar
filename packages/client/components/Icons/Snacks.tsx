<<<<<<< HEAD
import { Base, IconBaseFProps, IconPathBaseFProps, PathBase } from "./Base";

type SubComponents = {
  Path: typeof Path;
  Filled: typeof Filled;
  Colored: typeof Colored;
};

const Path: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      d="M21.4 18.5h-.3a1.8 1.8 0 00-.3-1.8a1.8 1.8 0 00.3-1.8h.3a.6.6 0 00.6-.6a3.7 3.7 0 00-3.7-3.7h-4.3l.1-1.6h.2a.6.6 0 00.6-.6V6.2a.6.6 0 00-.6-.6H9.5l1.6-2.4h2a.6.6 0 100-1.2h-2.3c-.2 0-.4.1-.5.3L8.1 5.6H2.6A.6.6 0 002 6.2v2.3c0 .3.3.6.6.6h.2l.7 12.3c0 .3.3.6.6.6H19.1A2.9 2.9 0 0022 19.1a.6.6 0 00-.6-.6zm-11.1-.6c0-.3.3-.6.6-.6h8.6a.6.6 0 010 1.2h-8.6a.6.6 0 01-.6-.6zm9.8-2.3a.6.6 0 01-.6.6h-8.6a.6.6 0 010-1.2h8.6c.3 0 .6.3.6.6zm.7-1.8H9.6a2.5 2.5 0 012.5-2h6.3c1.2 0 2.2.8 2.5 2zM3.2 6.8h10.5v1.2H3.2V6.8zm1 6A1.8 1.8 0 016.1 14.5a1.8 1.8 0 01-1.7 1.8l-.2-3.5zm.3 4.7a2.9 2.9 0 002.8-2.9a2.9 2.9 0 00-3.1-2.9l-.1-2.5h8.9l-.1 1.6h-.8a3.7 3.7 0 00-3.7 3.7c0 .3.3.6.6.6h.3a1.8 1.8 0 00.3 1.8a1.8 1.8 0 00-.3 1.8h-.3a.6.6 0 00-.6.6c0 .7.2 1.3.6 1.8H4.7l-.2-3.4zm14.6 3.4h-7.8A1.8 1.8 0 019.6 19.7h11.1a1.8 1.8 0 01-1.7 1.2z"
      {...props}
    />
  );
};

export const Snacks: React.FC<IconBaseFProps> & SubComponents = ({ ...props }) => {
  return (
    <Base {...props}>
      <Path />
    </Base>
  );
};

const Filled: React.FC<IconBaseFProps> = ({ ...props }) => {
  return (
    <Base {...props}>
      <PathBase d="M8 15.9a1.8 1.8 0 01-.9-1.5A4.9 4.9 0 0112 9.5h2l.1-1.6H2.7l.8 13.5c0 .3.3.6.6.6h3.6a2.9 2.9 0 01-.6-1.8c0-.8.5-1.4 1.2-1.7a2.3 2.3 0 010-2.6c-.2 0-.3-.1-.3-.1zM8.4 6.8h5.9a.6.6 0 100-1.2H9.5l1.6-2.4h2a.6.6 0 100-1.2h-2.3c-.2 0-.4.1-.5.3L8.1 5.6H2.6a.6.6 0 100 1.2h5.9z" />
      <PathBase d="M8.3 14.4c0 .3.3.6.6.6h12.5a.6.6 0 00.6-.6a3.7 3.7 0 00-3.7-3.7h-6.3a3.7 3.7 0 00-3.7 3.7zM10.3 16.1a1.2 1.2 0 100 2.3h9.8a1.2 1.2 0 100-2.3H10.3zM21.4 19.7h-12.5a.6.6 0 00-.6.6c0 1 .8 1.8 1.8 1.8h10.2A1.8 1.8 0 0022 20.2a.6.6 0 00-.6-.6z" />
    </Base>
  );
};

const Colored: React.FC<IconBaseFProps> = ({ ...props }) => {
  return <Filled className="icon__colored--snacks" {...props} />;
};


Snacks.Path = Path;
Snacks.Filled = Filled;
Snacks.Colored = Colored;

Snacks.displayName = "SnacksIcon";
Path.displayName = "SnacksPathIcon";
Filled.displayName = "SnacksFilledIcon";
Colored.displayName = "SnacksColoredIcon";

export default Snacks;
=======
import { Base, IconBaseFProps, IconPathBaseFProps, PathBase } from "./Base";

type SubComponents = {
  Path: typeof Path;
  Filled: typeof Filled;
  Colored: typeof Colored;
};

const Path: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      d="M21.4 18.5h-.3a1.8 1.8 0 00-.3-1.8a1.8 1.8 0 00.3-1.8h.3a.6.6 0 00.6-.6a3.7 3.7 0 00-3.7-3.7h-4.3l.1-1.6h.2a.6.6 0 00.6-.6V6.2a.6.6 0 00-.6-.6H9.5l1.6-2.4h2a.6.6 0 100-1.2h-2.3c-.2 0-.4.1-.5.3L8.1 5.6H2.6A.6.6 0 002 6.2v2.3c0 .3.3.6.6.6h.2l.7 12.3c0 .3.3.6.6.6H19.1A2.9 2.9 0 0022 19.1a.6.6 0 00-.6-.6zm-11.1-.6c0-.3.3-.6.6-.6h8.6a.6.6 0 010 1.2h-8.6a.6.6 0 01-.6-.6zm9.8-2.3a.6.6 0 01-.6.6h-8.6a.6.6 0 010-1.2h8.6c.3 0 .6.3.6.6zm.7-1.8H9.6a2.5 2.5 0 012.5-2h6.3c1.2 0 2.2.8 2.5 2zM3.2 6.8h10.5v1.2H3.2V6.8zm1 6A1.8 1.8 0 016.1 14.5a1.8 1.8 0 01-1.7 1.8l-.2-3.5zm.3 4.7a2.9 2.9 0 002.8-2.9a2.9 2.9 0 00-3.1-2.9l-.1-2.5h8.9l-.1 1.6h-.8a3.7 3.7 0 00-3.7 3.7c0 .3.3.6.6.6h.3a1.8 1.8 0 00.3 1.8a1.8 1.8 0 00-.3 1.8h-.3a.6.6 0 00-.6.6c0 .7.2 1.3.6 1.8H4.7l-.2-3.4zm14.6 3.4h-7.8A1.8 1.8 0 019.6 19.7h11.1a1.8 1.8 0 01-1.7 1.2z"
      {...props}
    />
  );
};

export const Snacks: React.FC<IconBaseFProps> & SubComponents = ({ ...props }) => {
  return (
    <Base {...props}>
      <Path />
    </Base>
  );
};

const Filled: React.FC<IconBaseFProps> = ({ ...props }) => {
  return (
    <Base {...props}>
      <PathBase d="M8 15.9a1.8 1.8 0 01-.9-1.5A4.9 4.9 0 0112 9.5h2l.1-1.6H2.7l.8 13.5c0 .3.3.6.6.6h3.6a2.9 2.9 0 01-.6-1.8c0-.8.5-1.4 1.2-1.7a2.3 2.3 0 010-2.6c-.2 0-.3-.1-.3-.1zM8.4 6.8h5.9a.6.6 0 100-1.2H9.5l1.6-2.4h2a.6.6 0 100-1.2h-2.3c-.2 0-.4.1-.5.3L8.1 5.6H2.6a.6.6 0 100 1.2h5.9z" />
      <PathBase d="M8.3 14.4c0 .3.3.6.6.6h12.5a.6.6 0 00.6-.6a3.7 3.7 0 00-3.7-3.7h-6.3a3.7 3.7 0 00-3.7 3.7zM10.3 16.1a1.2 1.2 0 100 2.3h9.8a1.2 1.2 0 100-2.3H10.3zM21.4 19.7h-12.5a.6.6 0 00-.6.6c0 1 .8 1.8 1.8 1.8h10.2A1.8 1.8 0 0022 20.2a.6.6 0 00-.6-.6z" />
    </Base>
  );
};

const Colored: React.FC<IconBaseFProps> = ({ ...props }) => {
  return <Filled className="icon__colored--snacks" {...props} />;
};


Snacks.Path = Path;
Snacks.Filled = Filled;
Snacks.Colored = Colored;

Snacks.displayName = "SnacksIcon";
Path.displayName = "SnacksPathIcon";
Filled.displayName = "SnacksFilledIcon";
Colored.displayName = "SnacksColoredIcon";

export default Snacks;
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
