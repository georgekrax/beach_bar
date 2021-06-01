import { Base, IconBaseFProps, IconPathBaseFProps, PathBase } from "../Base";

type SubComponents = {
  Filled: typeof Filled;
  Path1: typeof Path1;
  Path2: typeof Path2;
};

const Path1: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.54 15.48a8.5 8.5 0 10-1.143.968.759.759 0 00.073.082l5 5a.75.75 0 101.06-1.06l-4.99-4.99z"
      {...props}
    />
  );
};

const Path2: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      d="M7.5 12.44l2.97-2.94m0 0l3.03-3m-3.03 3L7.5 6.56m2.97 2.94l3.03 3"
      strokeLinecap="round"
      {...props}
    />
  );
};

export const NotFound: React.FC<IconBaseFProps> & SubComponents = ({ ...props }) => {
  return (
    <Base {...props}>
      <Path1 />
      <Path2 />
    </Base>
  );
};

const Filled: React.FC<IconBaseFProps> = ({ ...props }) => {
  return (
    <Base {...props}>
      <Path1 filled />
      <Path2 className="icon__filled-path--white" />
    </Base>
  );
};

Path1.displayName = "IconSearchNotFoundPath1";
Path2.displayName = "IconSearchNotFoundPath2";
Filled.displayName = "IconSearchNotFoundFilled";
NotFound.displayName = "IconSearchNotFound";

NotFound.Path1 = Path1;
NotFound.Path2 = Path2;
NotFound.Filled = Filled;
