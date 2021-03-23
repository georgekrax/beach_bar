import { Base, IconBaseFProps, IconPathBaseFProps, PathBase } from "./Base";

type SubComponents = {
  Filled: typeof Filled;
  Path: typeof Path;
};

export const Path: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      d="M 12.5 15 L 12 14.6 l -0.5 0.5 l -5.3 4.9 a 0.3 0.3 0 0 1 -0.4 -0.2 V 2 A 0.3 0.3 0 0 1 6 1.8 h 12 a 0.3 0.3 0 0 1 0.3 0.3 v 17.7 a 0.3 0.3 0 0 1 -0.4 0.2 l -5.3 -4.9 z"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    />
  );
};

const Bookmark: React.FC<IconBaseFProps> & SubComponents = ({ ...props }) => {
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

Bookmark.displayName = "BookmarkIcon";
Filled.displayName = "BookmarkFilledIcon";
Path.displayName = "BookmarkPathIcon";

Bookmark.Filled = Filled;
Bookmark.Path = Path;

export default Bookmark;
