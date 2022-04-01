import { Base, IconBaseFProps, IconPathBaseFProps, PathBase } from "./Base";

// Use the <Icons.UserAvatara />, if you want one person firgure

type SubComponents = {
  Path1: typeof Path1;
  Path2: typeof Path2;
  Path3: typeof Path3;
  Filled: typeof Filled;
};

const Path1: React.FC<IconPathBaseFProps> = ({ ...props }) => (
  <PathBase
    d="M11.8 7.8a3.8 3.8 0 11-7.6 0a3.8 3.8 0 017.6 0zM12.6 21H3.4c-1.5 0-2.7-1.4-2.4-2.8c.6-2.5 1.4-3.8 2.4-4.4c.5-.3 1.1-.2 1.6.1c.9.4 2.2 1 3 1c.9 0 2.3-.6 3.2-1.1c.4-.2.9-.3 1.3-.2c1.9.6 2.5 2.5 2.7 4.4C15.5 19.6 14.2 21 12.6 21z"
    {...props}
  />
);

const Path2: React.FC<IconPathBaseFProps> = ({ ...props }) => (
  <PathBase
    className="icon__filled-path--white"
    d="M18.5 7a4 4 0 11-8 0a4 4 0 018 0zM19.5 21H9.4c-1.5 0-2.7-1.4-2.4-2.8c.7-2.8 1.5-4.2 2.6-4.8c.5-.3 1.1-.2 1.6.1c.9.5 2.3 1.1 3.2 1.1c.9 0 2.5-.7 3.4-1.1c.4-.2.9-.3 1.3-.2c2.1.6 2.7 2.8 2.9 4.9c.2 1.6-1.1 3-2.7 3z"
    style={{ strokeWidth: 3 }}
    {...props}
  />
);

const Path3: React.FC<IconPathBaseFProps> = ({ ...props }) => (
  <PathBase
    d="M18.5 7a4 4 0 11-8 0a4 4 0 018 0zM19.5 21H9.4c-1.5 0-2.7-1.4-2.4-2.8c.7-2.8 1.5-4.2 2.6-4.8c.5-.3 1.1-.2 1.6.1c.9.5 2.3 1.1 3.2 1.1c.9 0 2.5-.7 3.4-1.1c.4-.2.9-.3 1.3-.2c2.1.6 2.7 2.8 2.9 4.9c.2 1.6-1.1 3-2.7 3z"
    {...props}
  />
);

export const People: React.FC<IconBaseFProps> & SubComponents = ({ ...props }) => {
  return (
    <Base {...props}>
      <Path1 />
      <Path2 />
      <Path3 />
    </Base>
  );
};

const Filled: React.FC<IconBaseFProps> = ({ ...props }) => {
  return (
    <Base {...props}>
      <Path1 filled />
      <Path2 />
      <Path3 filled />
    </Base>
  );
};

People.displayName = "IconPeople";
Path1.displayName = "IconPeoplePath1";
Path2.displayName = "IconPeoplePath2";
Path3.displayName = "IconPeoplePath3";
Filled.displayName = "IconPeopleFilled";

People.Path1 = Path1;
People.Path2 = Path2;
People.Path3 = Path3;
People.Filled = Filled;
