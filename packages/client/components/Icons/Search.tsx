import { Base, IconBaseFProps, IconPathBaseFProps, PathBase } from "./Base";

type SubComponents = {
  Filled: typeof Filled;
  Path: typeof Path;
};

export const Path: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      fillRule="evenodd"
      clipRule="evenodd"
      d="M 15.854 8.677 a 6.177 6.177 0 1 1 -12.354 0 a 6.177 6.177 0 0 1 12.354 0 z m -1.302 5.93 a 7.677 7.677 0 1 1 1.056 -1.056 a 0.73 0.73 0 0 1 0.052 0.049 l 6.12 6.12 a 0.75 0.75 0 0 1 -1.06 1.06 l -6.12 -6.12 a 0.73 0.73 0 0 1 -0.048 -0.052 z"
      {...props}
    />
  );
};

const Search: React.FC<IconBaseFProps> & SubComponents = ({ ...props }) => {
  return (
    <Base {...props}>
      <Path />
    </Base>
  );
};

export const Filled: React.FC<IconBaseFProps> = ({ ...props }) => {
  return (
    <Base {...props}>
      <Path
        filled
        d="M 15.608 13.552 a 7.677 7.677 0 1 0 -1.056 1.056 a 0.73 0.73 0 0 0 0.048 0.052 l 6.12 6.12 a 0.75 0.75 0 1 0 1.06 -1.06 l -6.12 -6.12 a 0.73 0.73 0 0 0 -0.052 -0.048 z"
      />
    </Base>
  );
};

Search.displayName = "SearchIcon";
Filled.displayName = "SearchFilledIcon";
Filled.displayName = "SearchPathIcon";

Search.Filled = Filled;
Search.Path = Path;

export default Search;
