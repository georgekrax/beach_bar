import { Base, IconBaseFProps, IconPathBaseFProps, PathBase } from "./Base";

type SubComponents = {
  Colored: typeof Colored;
};

export const Path1: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      d="M5.4 6 6.6 20.2A2 2 0 008.6 22h6.8a2 2 0 002-1.8L18.6 6M5.4 6l-.2-1.8A2 2 0 017.2 2h9.5a2 2 0 012 2.2L18.6 6M5.4 6H12.5m6.1 0H15"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    />
  );
};

export const Path2: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      d="M8.5 13.8a.5.5 0 01.1-.7l1.7-1.1a.5.5 0 01.7.1l1.1 1.7a.5.5 0 01-.1.7l-1.7 1.1a.5.5 0 01-.7-.1l-1.1-1.7zm3.7 2.6a.5.5 0 01.7-.2l1.8.8a.5.5 0 01.2.7l-.8 1.8a.5.5 0 01-.7.2l-1.8-.8a.5.5 0 01-.2-.7l.8-1.8zm.8-7.5a.5.5 0 01.6-.3l1.9.7a.5.5 0 01.3.6l-.7 1.9a.5.5 0 01-.6.3l-1.9-.7a.5.5 0 01-.3-.6l.7-1.9z"
      {...props}
    />
  );
};

export const Path3: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return <PathBase d="M7.2 21h9.6L18 6H6l1.2 15z" {...props} />;
};

export const FreshJuice: React.FC<IconBaseFProps> & SubComponents = ({ ...props }) => {
  return (
    <Base {...props}>
      <Path1 />
      <Path2 />
    </Base>
  );
};

export const Colored: React.FC<IconBaseFProps> = ({ ...props }) => {
  return (
    <Base {...props}>
      <Path3 className="icon__colored--fresh-juice__glass" />
      <Path1 />
      <Path2 className="icon__colored--fresh-juice__ice-cubes" />
    </Base>
  );
};

FreshJuice.displayName = "FreshJuiceIcon";
Colored.displayName = "FreshJuiceColoredIcon";
Path1.displayName = "FreshJuicePath1Icon";
Path2.displayName = "FreshJuicePath2Icon";
Path3.displayName = "FreshJuicePath3Icon";

FreshJuice.Colored = Colored;
