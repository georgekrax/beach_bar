import { Base, IconBaseFProps, IconPathBaseFProps, PathBase } from "./Base";

type SubComponents = {
  Path1: typeof Path1;
  Path2: typeof Path2;
  Path3: typeof Path3;
  Path4: typeof Path4;
  Path5: typeof Path5;
  Path6: typeof Path6;
  Path7: typeof Path7;
};

const Path1: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      d="M8.2 7.9l.1-.5-1-.1-.1.5 1 .1zm-4.1 8.7a.5.5 0 10.8.7l-.8-.7zm5.5-8.4.1-.5-1-.1-.1.5 1 .1zm-4 8.8a.5.5 0 10.8.7l-.8-.7zm-2.6-2.2a.5.5 0 000 1v-1zm7.7 6.4a.5.5 0 001 0h-1zm4.5-2.8a.5.5 0 100 1v-1zm7.1 1a.5.5 0 100-1v1zm-6.1.5a.5.5 0 100 1v-1zm5.3 1a.5.5 0 000-1v1zm-7.1-4.1a.5.5 0 000 1v-1zm8.9 1a.5.5 0 100-1v1zM7.2 7.8c-.3 2.7-.7 6.1-3.1 8.8l.8.7c2.7-3 3-6.7 3.3-9.4l-1-.1zm1.4.3c-.3 2.7-.6 6.2-3 8.9l.8.7c2.7-3 2.9-6.9 3.2-9.5l-1-.1zm-5.6 7.8c.9 0 1.7.1 2.4.2l.2-1a13.1 13.1 0 00-2.6-.3v1zm3.9.7c1.1.4 2.1 1.2 2.8 2c.7.9 1.1 1.8 1.1 2.7h1c0-1.1-.5-2.3-1.3-3.3c-.8-1-1.9-1.9-3.2-2.4l-.3.9zm15.2-5.2c0 1.7-1.4 3.1-3.1 3.1v1c2.2 0 4.1-1.8 4.1-4.1h-1zm-3.1 3.1c-1.7 0-3.1-1.4-3.1-3.1h-1c0 2.3 1.8 4.1 4.1 4.1v-1zm-3.1-3.1c0-1.7 1.4-3.1 3.1-3.1v-1c-2.2 0-4.1 1.8-4.1 4.1h1zm3.1-3.1c1.7 0 3.1 1.4 3.1 3.1h1c0-2.3-1.8-4.1-4.1-4.1v1zm-3.8 11.3h7.1v-1h-7.1v1zm1 1.5h5.3v-1h-5.3v1zm-1.8-3.1h8.9v-1h-8.9v1z"
      {...props}
    />
  );
};

const Path2: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase d="M5.2 7.8c-1.1 1.1-1.3 2.5-.6 3.2l3.8-3.8c-.7-.7-2.1-.4-3.2.6z" strokeLinejoin="round" {...props} />
  );
};

const Path3: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase d="M5.2 7.8c-1.1 1.1-1.3 2.5-.6 3.2l3.8-3.8c-.7-.7-2.1-.4-3.2.6z" strokeLinecap="round" {...props} />
  );
};

const Path4: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return <PathBase d="M7.6 4.1c1.1 1.1 1.3 2.5.6 3.2L4.4 3.5c.7-.7 2.1-.4 3.2.6z" strokeLinecap="round" {...props} />;
};

const Path5: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return <PathBase d="M11.5 7.6c1.1 1.1 1.3 2.5.6 3.2L8.3 7c.7-.7 2.1-.4 3.2.6z" strokeLinecap="round" {...props} />;
};

const Path6: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return <PathBase d="M11.2 5.2c1.5 0 2.7.8 2.7 1.8H8.5c0-1 1.2-1.8 2.7-1.8z" strokeLinecap="round" {...props} />;
};

const Path7: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return <PathBase d="M9.1 3.9c-1.1 1.1-1.3 2.5-.6 3.2l3.8-3.8c-.7-.7-2.1-.4-3.2.6z" strokeLinecap="round" {...props} />;
};

export const Beach: React.FC<IconBaseFProps> & SubComponents = ({ ...props }) => {
  return (
    <Base {...props}>
      <Path1 />
      <Path2 />
      <Path3 />
      <Path4 />
      <Path5 />
      <Path6 />
      <Path7 />
    </Base>
  );
};

const Filled: React.FC<IconBaseFProps> = ({ ...props }) => {
  return (
    <Base {...props}>
      <Path1 d="M8.25 12h7.5M12 15.75v-7.5" />
    </Base>
  );
};

Beach.displayName = "IconBeach";
Path1.displayName = "IconBeachPath1";
Path2.displayName = "IconBeachPath2";
Path3.displayName = "IconBeachPath3";
Path4.displayName = "IconBeachPath4";
Path5.displayName = "IconBeachPath5";
Path6.displayName = "IconBeachPath6";
Path7.displayName = "IconBeachPath7";

Beach.Path1 = Path1;
Beach.Path2 = Path2;
Beach.Path3 = Path3;
Beach.Path4 = Path4;
Beach.Path5 = Path5;
Beach.Path6 = Path6;
Beach.Path7 = Path7;
