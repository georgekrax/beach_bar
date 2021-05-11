import { Base, IconBaseFProps, IconPathBaseFProps, PathBase } from "../Base";
import { NotFound } from "./NotFound";

type SubComponents = {
  Filled: typeof Filled;
  Path: typeof Path;
  NotFound: typeof NotFound;
};

const Path: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.5 9.5a7 7 0 11-14 0a7 7 0 0114 0zm-2.1 6.95a8.5 8.5 0 111.14-.97l4.99 4.99a.75.75 0 11-1.06 1.06l-5-5a.76.76 0 01-.07-.08z"
      {...props}
    />
  );
};

export const Search: React.FC<IconBaseFProps> & SubComponents = ({ ...props }) => {
  return (
    <Base {...props}>
      <Path />
    </Base>
  );
};

const Filled: React.FC<IconBaseFProps> = ({ ...props }) => {
  return (
    <Base {...props}>
      <Path
        filled
        d="M 15.608 13.552 a 7.677 7.677 0 1 0 -1.056 1.056 a 0.73 0.73 0 0 0 0.048 0.052 l 6.12 6.12 a 0.75 0.75 0 1 0 1.06 -1.06 l -6.12 -6.12 a 0.73 0.73 0 0 0 -0.052 -0.048 z"
      />
    </Base>
  );
};

Path.displayName = "IconSearch";
Filled.displayName = "IconSearchFilled";

Search.Path = Path;
Search.Filled = Filled;
Search.NotFound = NotFound;

Search.displayName = "IconSearch";
