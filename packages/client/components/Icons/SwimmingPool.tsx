<<<<<<< HEAD
import { Base, IconBaseFProps, IconPathBaseFProps, PathBase } from "./Base";

type SubComponents = {
  Path: typeof Path;
  Colored: typeof Colored;
};

const Path: React.FC<IconPathBaseFProps> = ({ ...props }) => (
  <PathBase
    d="M10.5 4.3a.8.8 0 001.5 0h-1.5zm-7.1 0a.8.8 0 101.5 0h-1.5zm11.4 10.7a.8.8 0 001.5 0h-1.5zM7.6 13.7a.8.8 0 001.5 0h-1.5zm7.7-5.8a.8.8 0 000-1.5v1.5zm-6.8-1.5a.8.8 0 000 1.5v-1.5zm.2 2.8a.8.8 0 100 1.5v-1.5zm13.7 12.2a.8.8 0 00.8-1.3l-.8 1.3zm-4.3-.7-.4-.6.4.6zm-1.6 1 .4.6-.4-.6zm-2.2 0 .4-.6-.4.6zm-1.5-.9.4-.6-.4.6zm-4.7 0 .4.6-.4-.6zm-1.6 1 .4.6-.4-.6zm-2.1 0-.4.6.4-.6zM3.4 20.1A.8.8 0 102.6 21.4L3.4 20.1zm19-5.5a.8.8 0 10.8-1.3l-.8 1.3zm-4.3-.7-.4-.6.4.6zm-1.6 1 .4.6-.4-.6zm-2.2 0 .4-.6-.4.6zm-1.5-.9.4-.6-.4.6zm-4.7 0 .4.6-.4-.6zm-1.6 1 .4.6-.4-.6zm-2.1 0-.4.6.4-.6zM3.4 13.4a.8.8 0 00-.8 1.3L3.4 13.3zm19 4.6a.8.8 0 00.8-1.3l-.8 1.3zm-4.3-.7-.4-.6.4.6zm-1.6 1 .4.6-.4-.6zm-2.2 0 .4-.6-.4.6zm-1.5-.9.4-.6-.4.6zm-4.7 0 .4.6-.4-.6zm-1.6 1 .4.6-.4-.6zm-2.1 0-.4.6.4-.6zM3.4 16.7a.8.8 0 10-.8 1.3l.8-1.3zM16.3 4.3c0-1.6-1.3-3-2.9-3v1.5c.7 0 1.4.6 1.4 1.5h1.5zM13.4 1.3c-1.6 0-2.9 1.4-2.9 3h1.5c0-.9.7-1.5 1.4-1.5v-1.5zm-4.3 3c0-1.6-1.3-3-2.9-3v1.5c.7 0 1.4.6 1.4 1.5h1.5zM6.2 1.3c-1.6 0-2.9 1.4-2.9 3h1.5c0-.9.7-1.5 1.4-1.5v-1.5zm8.5 3v5.6h1.5V4.3h-1.5zm0 5.6v5.1h1.5V9.9h-1.5zM7.6 4.3v9.4h1.5V4.3h-1.5zm7.7 2.1H8.5v1.5h6.8v-1.5zM15.5 9.2H8.7v1.5H15.5v-1.5zm7.7 11a5.2 5.2 0 00-5.5 0l.8 1.3a3.7 3.7 0 013.9 0l.8-1.3zm-5.5 0-1.6 1 .8 1.3 1.6-1-.8-1.3zm-1.6 1c-.4.3-.9.3-1.4 0l-.8 1.3a2.8 2.8 0 002.9 0l-.8-1.3zm-1.4 0-1.5-.9-.8 1.3 1.5.9.8-1.3zm-1.5-.9a5.2 5.2 0 00-5.5 0l.8 1.3a3.7 3.7 0 013.9 0l.8-1.3zm-5.5 0-1.6 1 .8 1.3 1.6-1-.8-1.3zm-1.6 1c-.4.3-.9.3-1.4 0l-.8 1.3a2.8 2.8 0 002.9 0l-.8-1.3zm-1.4 0-1.5-.9L2.6 21.4l1.5.9.8-1.3zM23.2 13.3a5.2 5.2 0 00-5.5 0l.8 1.3a3.7 3.7 0 013.9 0l.8-1.3zm-5.5 0-1.6 1 .8 1.3 1.6-1-.8-1.3zm-1.6 1c-.4.3-.9.3-1.4 0l-.8 1.3a2.8 2.8 0 002.9 0l-.8-1.3zm-1.4 0-1.5-.9-.8 1.3 1.5.9.8-1.3zm-1.5-.9a5.2 5.2 0 00-5.5 0l.8 1.3a3.7 3.7 0 013.9 0l.8-1.3zm-5.5 0-1.6 1 .8 1.3 1.6-1-.8-1.3zm-1.6 1c-.4.3-.9.3-1.4 0l-.8 1.3a2.8 2.8 0 002.9 0l-.8-1.3zm-1.4 0-1.5-.9-.8 1.3 1.5.9.8-1.3zM23.2 16.7a5.2 5.2 0 00-5.5 0l.8 1.3a3.7 3.7 0 013.9 0l.8-1.3zm-5.5 0-1.6 1 .8 1.3 1.6-1-.8-1.3zm-1.6 1c-.4.3-.9.3-1.4 0l-.8 1.3a2.8 2.8 0 002.9 0l-.8-1.3zM14.8 17.6l-1.5-.9-.8 1.3 1.5.9.8-1.3zm-1.5-.9a5.2 5.2 0 00-5.5 0l.8 1.3a3.7 3.7 0 013.9 0l.8-1.3zm-5.5 0-1.6 1 .8 1.3 1.6-1-.8-1.3zm-1.6 1c-.4.3-.9.3-1.4 0l-.8 1.3a2.8 2.8 0 002.9 0l-.8-1.3zM4.9 17.6l-1.5-.9-.8 1.3 1.5.9.8-1.3z"
    {...props}
  />
);

export const SwimmingPool: React.FC<IconBaseFProps> & SubComponents = ({ ...props }) => (
  <Base {...props}>
    <Path />
  </Base>
);

const Colored: React.FC<IconBaseFProps> = ({ ...props }) => (
  <SwimmingPool className="icon__colored--fill icon__stroke--none" {...props} />
);

SwimmingPool.displayName = "IconSwimmingPool";
Path.displayName = "IconSwimmingPoolPath";
Colored.displayName = "IconSwimmingPoolColored";

SwimmingPool.Path = Path;
SwimmingPool.Colored = Colored;

export default SwimmingPool;
=======
import { Base, IconBaseFProps, IconPathBaseFProps, PathBase } from "./Base";

type SubComponents = {
  Path: typeof Path;
  Colored: typeof Colored;
};

const Path: React.FC<IconPathBaseFProps> = ({ ...props }) => (
  <PathBase
    d="M10.5 4.3a.8.8 0 001.5 0h-1.5zm-7.1 0a.8.8 0 101.5 0h-1.5zm11.4 10.7a.8.8 0 001.5 0h-1.5zM7.6 13.7a.8.8 0 001.5 0h-1.5zm7.7-5.8a.8.8 0 000-1.5v1.5zm-6.8-1.5a.8.8 0 000 1.5v-1.5zm.2 2.8a.8.8 0 100 1.5v-1.5zm13.7 12.2a.8.8 0 00.8-1.3l-.8 1.3zm-4.3-.7-.4-.6.4.6zm-1.6 1 .4.6-.4-.6zm-2.2 0 .4-.6-.4.6zm-1.5-.9.4-.6-.4.6zm-4.7 0 .4.6-.4-.6zm-1.6 1 .4.6-.4-.6zm-2.1 0-.4.6.4-.6zM3.4 20.1A.8.8 0 102.6 21.4L3.4 20.1zm19-5.5a.8.8 0 10.8-1.3l-.8 1.3zm-4.3-.7-.4-.6.4.6zm-1.6 1 .4.6-.4-.6zm-2.2 0 .4-.6-.4.6zm-1.5-.9.4-.6-.4.6zm-4.7 0 .4.6-.4-.6zm-1.6 1 .4.6-.4-.6zm-2.1 0-.4.6.4-.6zM3.4 13.4a.8.8 0 00-.8 1.3L3.4 13.3zm19 4.6a.8.8 0 00.8-1.3l-.8 1.3zm-4.3-.7-.4-.6.4.6zm-1.6 1 .4.6-.4-.6zm-2.2 0 .4-.6-.4.6zm-1.5-.9.4-.6-.4.6zm-4.7 0 .4.6-.4-.6zm-1.6 1 .4.6-.4-.6zm-2.1 0-.4.6.4-.6zM3.4 16.7a.8.8 0 10-.8 1.3l.8-1.3zM16.3 4.3c0-1.6-1.3-3-2.9-3v1.5c.7 0 1.4.6 1.4 1.5h1.5zM13.4 1.3c-1.6 0-2.9 1.4-2.9 3h1.5c0-.9.7-1.5 1.4-1.5v-1.5zm-4.3 3c0-1.6-1.3-3-2.9-3v1.5c.7 0 1.4.6 1.4 1.5h1.5zM6.2 1.3c-1.6 0-2.9 1.4-2.9 3h1.5c0-.9.7-1.5 1.4-1.5v-1.5zm8.5 3v5.6h1.5V4.3h-1.5zm0 5.6v5.1h1.5V9.9h-1.5zM7.6 4.3v9.4h1.5V4.3h-1.5zm7.7 2.1H8.5v1.5h6.8v-1.5zM15.5 9.2H8.7v1.5H15.5v-1.5zm7.7 11a5.2 5.2 0 00-5.5 0l.8 1.3a3.7 3.7 0 013.9 0l.8-1.3zm-5.5 0-1.6 1 .8 1.3 1.6-1-.8-1.3zm-1.6 1c-.4.3-.9.3-1.4 0l-.8 1.3a2.8 2.8 0 002.9 0l-.8-1.3zm-1.4 0-1.5-.9-.8 1.3 1.5.9.8-1.3zm-1.5-.9a5.2 5.2 0 00-5.5 0l.8 1.3a3.7 3.7 0 013.9 0l.8-1.3zm-5.5 0-1.6 1 .8 1.3 1.6-1-.8-1.3zm-1.6 1c-.4.3-.9.3-1.4 0l-.8 1.3a2.8 2.8 0 002.9 0l-.8-1.3zm-1.4 0-1.5-.9L2.6 21.4l1.5.9.8-1.3zM23.2 13.3a5.2 5.2 0 00-5.5 0l.8 1.3a3.7 3.7 0 013.9 0l.8-1.3zm-5.5 0-1.6 1 .8 1.3 1.6-1-.8-1.3zm-1.6 1c-.4.3-.9.3-1.4 0l-.8 1.3a2.8 2.8 0 002.9 0l-.8-1.3zm-1.4 0-1.5-.9-.8 1.3 1.5.9.8-1.3zm-1.5-.9a5.2 5.2 0 00-5.5 0l.8 1.3a3.7 3.7 0 013.9 0l.8-1.3zm-5.5 0-1.6 1 .8 1.3 1.6-1-.8-1.3zm-1.6 1c-.4.3-.9.3-1.4 0l-.8 1.3a2.8 2.8 0 002.9 0l-.8-1.3zm-1.4 0-1.5-.9-.8 1.3 1.5.9.8-1.3zM23.2 16.7a5.2 5.2 0 00-5.5 0l.8 1.3a3.7 3.7 0 013.9 0l.8-1.3zm-5.5 0-1.6 1 .8 1.3 1.6-1-.8-1.3zm-1.6 1c-.4.3-.9.3-1.4 0l-.8 1.3a2.8 2.8 0 002.9 0l-.8-1.3zM14.8 17.6l-1.5-.9-.8 1.3 1.5.9.8-1.3zm-1.5-.9a5.2 5.2 0 00-5.5 0l.8 1.3a3.7 3.7 0 013.9 0l.8-1.3zm-5.5 0-1.6 1 .8 1.3 1.6-1-.8-1.3zm-1.6 1c-.4.3-.9.3-1.4 0l-.8 1.3a2.8 2.8 0 002.9 0l-.8-1.3zM4.9 17.6l-1.5-.9-.8 1.3 1.5.9.8-1.3z"
    {...props}
  />
);

export const SwimmingPool: React.FC<IconBaseFProps> & SubComponents = ({ ...props }) => (
  <Base {...props}>
    <Path />
  </Base>
);

const Colored: React.FC<IconBaseFProps> = ({ ...props }) => (
  <SwimmingPool className="icon__colored--fill icon__stroke--none" {...props} />
);

SwimmingPool.displayName = "IconSwimmingPool";
Path.displayName = "IconSwimmingPoolPath";
Colored.displayName = "IconSwimmingPoolColored";

SwimmingPool.Path = Path;
SwimmingPool.Colored = Colored;

export default SwimmingPool;
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
