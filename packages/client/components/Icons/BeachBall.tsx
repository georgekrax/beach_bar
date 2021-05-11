<<<<<<< HEAD
import { Base, IconBaseFProps, IconPathBaseFProps, PathBase } from "./Base";

type SubComponents = {
  Path1: typeof Path1;
  Path2: typeof Path2;
  Path3: typeof Path3;
  Filled: typeof Filled;
};

const Path1: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      d="M21.5 12c0 5.5-4.5 10-10 10a10 10 0 01-7.1-3A10 10 0 011.5 12c0-5.5 4.5-10 10-10a10 10 0 017 2.9a10 10 0 013 7.1z"
      {...props}
    />
  );
};

const Path2: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return <PathBase d="M17.5 8.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" {...props} />;
};

const Path3: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      d="M9.4 1.8a.5.5 0 10-.3 1l.3-1zM14 6a.5.5 0 001 0h-1zm7 6a9.5 9.5 0 01-9.5 9.5v1C17.3 22.5 22 17.8 22 12h-1zM2 12a9.5 9.5 0 019.5-9.5v-1C5.7 1.5 1 6.2 1 12h1zm9.5 9.5a9.5 9.5 0 01-6.8-2.9l-.7.7A10.5 10.5 0 0011.5 22.5v-1zm-6.8-2.9A9.5 9.5 0 012 12H1c0 2.9 1.1 5.5 3 7.3l.7-.7zm0 .7 8.6-8.5-.7-.7-8.6 8.5.7.7zM11.5 2.5a9.5 9.5 0 016.7 2.7l.7-.7A10.5 10.5 0 0011.5 1.5v1zm6.7 2.7A9.5 9.5 0 0121 12h1a10.5 10.5 0 00-3.1-7.5l-.7.7zm0-.7-1.6 1.6.7.7 1.6-1.6-.7-.7zM16.2 10.7c.1.1.1.3.2.6c0 .3 0 .7 0 1.2c-.1.9-.5 2.1-1.1 3.2c-1.2 2.3-3.5 4.5-7.3 5.2l.2 1c4.2-.7 6.7-3.2 8.1-5.7c.7-1.2 1.1-2.5 1.2-3.5c.1-.5.1-1 0-1.4c0-.4-.1-.8-.3-1.1l-.8.6zm-3.1-3.5c-1.9-1.3-8-1-11.6 7.7l.9.4c3.5-8.3 9-8 10.1-7.2l.6-.8zM17 8.5a2 2 0 01-2 2v1a3 3 0 003-3h-1zm-2 2a2 2 0 01-2-2h-1a3 3 0 003 3v-1zm-2-2a2 2 0 012-2v-1a3 3 0 00-3 3h1zm2-2a2 2 0 012 2h1a3 3 0 00-3-3v1zm2.1 3.1c.5.5 1.4 1.5 2.2 2.6c.4.5.7 1.1.9 1.6c.2.5.4.9.4 1.2h1c0-.5-.2-1.1-.5-1.6a12.6 12.6 0 00-1-1.7c-.8-1.1-1.7-2.2-2.4-2.8l-.7.8zM9.1 2.7c.9.3 2.2.9 3.2 1.7c.5.4.9.7 1.3 1c.2.2.3.3.3.4c.1.1.1.2.1.2h1c0-.3-.1-.5-.2-.7a3.4 3.4 0 00-.5-.6c-.4-.4-.9-.8-1.4-1.2c-1.1-.8-2.4-1.5-3.5-1.8l-.3 1z"
      {...props}
    />
  );
};

export const BeachBall: React.FC<IconBaseFProps> & SubComponents = ({ ...props }) => {
  return (
    <Base {...props}>
      <Path1 />
      <Path2 />
      <Path3 />
    </Base>
  );
};

const Filled: React.FC<IconBaseFProps> = ({ ...props }) => {
  return (
    <Base {...props}>
      <Path1 filled  />
      <Path2 filled />
      <Path3 className="icon__filled--white" />
    </Base>
  );
};

BeachBall.displayName = "BeachBallIcon";
Filled.displayName = "BeachBallFilledIcon";
Path1.displayName = "BeachBallPath1Icon";
Path2.displayName = "BeachBallPath2Icon";
Path3.displayName = "BeachBallPath3Icon";

BeachBall.Filled = Filled;
BeachBall.Path1 = Path1;
BeachBall.Path2 = Path2;
BeachBall.Path3 = Path3;

export default BeachBall;
=======
import { Base, IconBaseFProps, IconPathBaseFProps, PathBase } from "./Base";

type SubComponents = {
  Path1: typeof Path1;
  Path2: typeof Path2;
  Path3: typeof Path3;
  Filled: typeof Filled;
};

const Path1: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      d="M21.5 12c0 5.5-4.5 10-10 10a10 10 0 01-7.1-3A10 10 0 011.5 12c0-5.5 4.5-10 10-10a10 10 0 017 2.9a10 10 0 013 7.1z"
      {...props}
    />
  );
};

const Path2: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return <PathBase d="M17.5 8.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" {...props} />;
};

const Path3: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      d="M9.4 1.8a.5.5 0 10-.3 1l.3-1zM14 6a.5.5 0 001 0h-1zm7 6a9.5 9.5 0 01-9.5 9.5v1C17.3 22.5 22 17.8 22 12h-1zM2 12a9.5 9.5 0 019.5-9.5v-1C5.7 1.5 1 6.2 1 12h1zm9.5 9.5a9.5 9.5 0 01-6.8-2.9l-.7.7A10.5 10.5 0 0011.5 22.5v-1zm-6.8-2.9A9.5 9.5 0 012 12H1c0 2.9 1.1 5.5 3 7.3l.7-.7zm0 .7 8.6-8.5-.7-.7-8.6 8.5.7.7zM11.5 2.5a9.5 9.5 0 016.7 2.7l.7-.7A10.5 10.5 0 0011.5 1.5v1zm6.7 2.7A9.5 9.5 0 0121 12h1a10.5 10.5 0 00-3.1-7.5l-.7.7zm0-.7-1.6 1.6.7.7 1.6-1.6-.7-.7zM16.2 10.7c.1.1.1.3.2.6c0 .3 0 .7 0 1.2c-.1.9-.5 2.1-1.1 3.2c-1.2 2.3-3.5 4.5-7.3 5.2l.2 1c4.2-.7 6.7-3.2 8.1-5.7c.7-1.2 1.1-2.5 1.2-3.5c.1-.5.1-1 0-1.4c0-.4-.1-.8-.3-1.1l-.8.6zm-3.1-3.5c-1.9-1.3-8-1-11.6 7.7l.9.4c3.5-8.3 9-8 10.1-7.2l.6-.8zM17 8.5a2 2 0 01-2 2v1a3 3 0 003-3h-1zm-2 2a2 2 0 01-2-2h-1a3 3 0 003 3v-1zm-2-2a2 2 0 012-2v-1a3 3 0 00-3 3h1zm2-2a2 2 0 012 2h1a3 3 0 00-3-3v1zm2.1 3.1c.5.5 1.4 1.5 2.2 2.6c.4.5.7 1.1.9 1.6c.2.5.4.9.4 1.2h1c0-.5-.2-1.1-.5-1.6a12.6 12.6 0 00-1-1.7c-.8-1.1-1.7-2.2-2.4-2.8l-.7.8zM9.1 2.7c.9.3 2.2.9 3.2 1.7c.5.4.9.7 1.3 1c.2.2.3.3.3.4c.1.1.1.2.1.2h1c0-.3-.1-.5-.2-.7a3.4 3.4 0 00-.5-.6c-.4-.4-.9-.8-1.4-1.2c-1.1-.8-2.4-1.5-3.5-1.8l-.3 1z"
      {...props}
    />
  );
};

export const BeachBall: React.FC<IconBaseFProps> & SubComponents = ({ ...props }) => {
  return (
    <Base {...props}>
      <Path1 />
      <Path2 />
      <Path3 />
    </Base>
  );
};

const Filled: React.FC<IconBaseFProps> = ({ ...props }) => {
  return (
    <Base {...props}>
      <Path1 filled  />
      <Path2 filled />
      <Path3 className="icon__filled--white" />
    </Base>
  );
};

BeachBall.displayName = "BeachBallIcon";
Filled.displayName = "BeachBallFilledIcon";
Path1.displayName = "BeachBallPath1Icon";
Path2.displayName = "BeachBallPath2Icon";
Path3.displayName = "BeachBallPath3Icon";

BeachBall.Filled = Filled;
BeachBall.Path1 = Path1;
BeachBall.Path2 = Path2;
BeachBall.Path3 = Path3;

export default BeachBall;
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
