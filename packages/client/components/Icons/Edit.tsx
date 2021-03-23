import { Base, IconBaseFProps, IconPathBaseFProps, PathBase } from "./Base";

type SubComponents = {
  Path1: typeof Path1;
  Path2: typeof Path2;
};

export const Path1: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      d="M9.5 12l6.7-6.7 2.6 2.7L11.8 15l-3.6.9c0 0 0 0 0 0a.1.1 0 010 0a.1.1 0 010 0c0 0 0 0 0 0l1.3-3.9zm7.7-7.7 1.4-1.3a1.3 1.3 0 011.8 0l.8.8a1.3 1.3 0 010 1.7l-1.4 1.4-2.6-2.6z"
      {...props}
    />
  );
};

export const Path2: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      d="M12 2H6a4 4 0 00-4 4v12a4 4 0 004 4h12a4 4 0 004-4v-6"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    />
  );
};

export const Edit: React.FC<IconBaseFProps> & SubComponents = ({ ...props }) => {
  return (
    <Base {...props}>
      <Path1 />
      <Path2 />
    </Base>
  );
};

Edit.displayName = "EditIcon";
Path1.displayName = "EditPath1Icon";
Path2.displayName = "EditPath2Icon";

Edit.Path1 = Path1;
Edit.Path2 = Path2;
