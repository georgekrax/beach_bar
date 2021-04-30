import { Base, IconBaseFProps, IconPathBaseFProps, PathBase } from "./Base";

type SubComponents = {
  Path: typeof Path;
  Filled: typeof Filled;
};

const Path: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      d="M15.3 18.7 7.2 14.4M15.3 6.8 7.2 11M21 5.8a2.9 2.9 0 11-5.7 0a2.9 2.9 0 015.7 0zm0 13.3a2.9 2.9 0 11-5.7 0a2.9 2.9 0 015.7 0zM7.7 12.5a2.9 2.9 0 11-5.7 0a2.9 2.9 0 015.7 0z"
      {...props}
    />
  );
};

export const Share: React.FC<IconBaseFProps> & SubComponents = ({ ...props }) => {
  return (
    <Base {...props}>
      <Path />
    </Base>
  );
};

const Filled: React.FC<IconBaseFProps> = ({ ...props }) => {
  return (
    <Base {...props}>
      <Path d="M8.25 12h7.5M12 15.75v-7.5" />
    </Base>
  );
};

Share.displayName = "IconShare";
Path.displayName = "IconSharePath";
Filled.displayName = "IconShareFilled";

Share.Path = Path;
Share.Filled = Filled;
