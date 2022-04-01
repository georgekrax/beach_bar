import { Base, IconBaseFProps, IconPathBaseFProps, PathBase } from "./Base";

type SubComponents = {
  Path: typeof Path;
  // Filled: typeof Filled;
};

const Path: React.FC<IconPathBaseFProps> = ({ ...props }) => (
  <PathBase
    filled
    d="M3.3 12a.8.8 0 001.5 0h-1.5zm3.6 5.5a.8.8 0 00-1.1 1l1.1-1zM4 13.3l-.6.5a.8.8 0 001.1 0L4 13.3zm2.8-2a.8.8 0 10-1.1-1l1.1 1zm-4.5-1a.8.8 0 10-1.1 1l1.1-1zM13.3 7a.8.8 0 00-1.5 0h1.5zm-.8 5h-.8c0 .2.1.4.2.5l.5-.5zm3 4a.8.8 0 101.1-1.1l-1.1 1.1zM21.3 12A8.3 8.3 0 0113 20.3v1.5c5.4 0 9.8-4.4 9.8-9.8h-1.5zm-16.5 0A8.3 8.3 0 0113 3.8v-1.5c-5.4 0-9.8 4.4-9.8 9.8h1.5zM13 3.8A8.3 8.3 0 0121.3 12h1.5c0-5.4-4.4-9.8-9.8-9.8v1.5zm0 16.5a8.2 8.2 0 01-6.2-2.8l-1.1 1A9.7 9.7 0 0013 21.8v-1.5zm-8.4-6.5 2.3-2.5-1.1-1-2.3 2.5 1.1 1zm-3.4-2.5 2.3 2.5 1.1-1-2.3-2.5-1.1 1zM11.8 7v5h1.5V7h-1.5zm.2 5.5 3.5 3.5 1.1-1.1-3.5-3.5-1.1 1.1z"
    {...props}
  />
);

export const History: React.FC<IconBaseFProps> & SubComponents = ({ className, ...props }) => {
  return (
    <Base className={"icon__stroke--none__path" + className ? " " + className : ""} {...props}>
      <Path />
    </Base>
  );
};

// const Filled: React.FC<IconBaseFProps> = ({ ...props }) => {
//   return (
//     <Base {...props}>
//       <Path />
//     </Base>
//   );
// };

History.Path = Path;

History.displayName = "IconHistory";
Path.displayName = "IconHistoryPath";
