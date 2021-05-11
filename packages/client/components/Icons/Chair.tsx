<<<<<<< HEAD
import { Base, IconBaseFProps, IconPathBaseFProps, PathBase } from "./Base";

type SubComponents = {
  Path: typeof Path;
  Colored: typeof Colored;
};

const Path: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      className="icon__stroke--sm"
      d="M20 12c-.489-2-.781-2-3-2l-.833.001m-8.8 3.5l-2.445 5.5-1.466-1 2.444-5.5-4.4-10.5 1.956-1 3.422 9 1.466-4h7.823v4m-8.8 3.5h6.844m-6.844 0l.666-1.5m6.178 1.5v6h1.956v-6m-1.956 0v-1.5m0 0H8.033m6.178 0v-2m-6.178 2l.89-2m5.288 0v-2.25h-4.4l-.889 2.25m5.29 0h-5.29m7.245 2h4.889l2.444 5.5-1.467 1-1.955-5h-3.911m0-1.5v1.5m0-1.5v-2m-8.556-2L6.39 2.396C5.839 1.3 4.824.774 3.663 1.09"
      {...props}
    />
  );
};

export const Chair: React.FC<IconBaseFProps> & SubComponents = ({ ...props }) => {
  return (
    <Base {...props}>
      <Path />
    </Base>
  );
};

const Colored: React.FC<IconBaseFProps> = ({ ...props }) => {
  return <Chair className="icon__colored--chair" {...props} />;
};

Chair.Path = Path;
Chair.Colored = Colored;

Chair.displayName = "IconChair";
Path.displayName = "IconChairPath";
Colored.displayName = "IconChairColored";
=======
import { Base, IconBaseFProps, IconPathBaseFProps, PathBase } from "./Base";

type SubComponents = {
  Path: typeof Path;
  Colored: typeof Colored;
};

const Path: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      className="icon__stroke--sm"
      d="M20 12c-.489-2-.781-2-3-2l-.833.001m-8.8 3.5l-2.445 5.5-1.466-1 2.444-5.5-4.4-10.5 1.956-1 3.422 9 1.466-4h7.823v4m-8.8 3.5h6.844m-6.844 0l.666-1.5m6.178 1.5v6h1.956v-6m-1.956 0v-1.5m0 0H8.033m6.178 0v-2m-6.178 2l.89-2m5.288 0v-2.25h-4.4l-.889 2.25m5.29 0h-5.29m7.245 2h4.889l2.444 5.5-1.467 1-1.955-5h-3.911m0-1.5v1.5m0-1.5v-2m-8.556-2L6.39 2.396C5.839 1.3 4.824.774 3.663 1.09"
      {...props}
    />
  );
};

export const Chair: React.FC<IconBaseFProps> & SubComponents = ({ ...props }) => {
  return (
    <Base {...props}>
      <Path />
    </Base>
  );
};

const Colored: React.FC<IconBaseFProps> = ({ ...props }) => {
  return <Chair className="icon__colored--chair" {...props} />;
};

Chair.Path = Path;
Chair.Colored = Colored;

Chair.displayName = "IconChair";
Path.displayName = "IconChairPath";
Colored.displayName = "IconChairColored";
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
