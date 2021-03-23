import { Base, IconBaseFProps, IconPathBaseFProps, PathBase } from "./Base";

type SubComponents = {
  Path: typeof Path;
};

export const Path: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      d="M6.19 3v7.53M6.43 21v-8.02m0 0H4m2.43 0h2.43m9.24 7.77V15.9m0 0h-2.43m2.43 0h2.43M18.11 3v10.45M12.27 3v4.86m0 0H9.84m2.43 0h2.43m-2.43 12.9v-10.45"
      strokeLinecap="round"
      {...props}
    />
  );
};

const Filters: React.FC<IconBaseFProps> & SubComponents = ({ ...props }) => {
  return (
    <Base {...props}>
      <Path />
    </Base>
  );
};

Filters.displayName = "FiltersIcon";
Path.displayName = "FiltersPathIcon";

Filters.Path = Path;

export default Filters;
