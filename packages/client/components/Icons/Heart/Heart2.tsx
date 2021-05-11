import { Base, IconBaseFProps, IconPathBaseFProps, PathBase } from "../Base";

type SubComponents = {
  Path1: typeof Path1;
  Path2: typeof Path2;
  Colored: typeof Colored;
};

const Path1: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      d="M12.93 5.72l.02-.02.1-.09c.45-.42.98-.75 1.56-.99a5.27 5.27 0 013.96.01c.63.26 1.2.63 1.68 1.1l.53-.54-.53.54c.48.47.86 1.03 1.12 1.64a4.94 4.94 0 01.01 3.85a5 5 0 01-1 1.52l-.11.12-7.55 7.4a.25.25 0 01-.35 0l-7.53-7.39-.13-.14a5.08 5.08 0 01-1.04-1.56a4.94 4.94 0 01-.4-1.91a4.88 4.88 0 011.47-3.52a5.04 5.04 0 011.65-1.08a5.18 5.18 0 011.96-.37a5.25 5.25 0 013.56 1.42l.53.49.52-.51z"
      {...props}
    />
  );
};

const Path2: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return <PathBase d="M9.5 9.15l3-3" strokeLinecap="round" {...props} />;
};

export const Heart2: React.FC<IconBaseFProps> & SubComponents = ({ ...props }) => {
  return (
    <Base {...props}>
      <Path1 />
      <Path2 />
    </Base>
  );
};

const Colored: React.FC<IconBaseFProps> = ({ ...props }) => {
  return (
    <Base {...props}>
      <Path1 filled />
      <Path2 className="icon__filled-path--white" />
    </Base>
  );
};

Heart2.displayName = "IconHeart2";
Path1.displayName = "IconHeart2Path1";
Path2.displayName = "IconHeart2Path2";

Heart2.Path1 = Path1;
Heart2.Path2 = Path2;
Heart2.Colored = Colored;
