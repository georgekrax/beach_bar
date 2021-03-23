import { Base, IconBaseFProps, IconPathBaseFProps, PathBase } from "./Base";

type SubComponents = {
  Path: typeof Path;
  Filled: typeof Filled;
};

const Path: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      d="M11.1 3.3c.3-.8 1.5-.8 1.9 0l6.8 16.7c.4.9-.7 1.8-1.5 1.2l-5.7-3.8a1 1 0 00-1.1 0l-5.7 3.8c-.8.5-1.9-.3-1.5-1.2l6.8-16.7z"
      {...props}
    />
  );
};

export const Navigation: React.FC<IconBaseFProps> & SubComponents = ({ ...props }) => {
  return (
    <Base {...props}>
      <Path />
    </Base>
  );
};

const Filled: React.FC<IconBaseFProps> = ({ ...props }) => {
  return (
    <Base {...props}>
      <Path filled />
    </Base>
  );
};

Navigation.displayName = "IconNavigation";
Path.displayName = "IconNavigationPath";
Filled.displayName = "IconNavigationFilled";

Navigation.Path = Path;
Navigation.Filled = Filled;
