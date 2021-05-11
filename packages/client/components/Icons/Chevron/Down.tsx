import { Base, IconBaseFProps, IconPathBaseFProps, PathBase } from "../Base";

type SubComponents = {
  Path: typeof Path;
};

export const Path: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return <PathBase d="M21 7l-9 10L3 7" strokeLinecap="round" strokeLinejoin="round" {...props} />;
};

export const Down: React.FC<IconBaseFProps> & SubComponents = ({ ...props }) => {
  return (
    <Base width={24} height={24} {...props}>
      <Path />
    </Base>
  );
};

// export const Filled: React.FC<IconBaseFProps> = ({ ...props }) => {
//   return (
//     <Base {...props}>
//       <Path
//         filled
//         d="M 7.5 17.095 l -4.98 2.561 a 0.7 0.7 0 0 1 -1.02 -0.622 V 7.332 a 0.7 0.7 0 0 1 0.38 -0.622 L 7.5 3.82 v 13.275 z m 1 -13.322 l 7 3.15 v 13.304 l -7 -3.15 V 3.773 z m 8 3.132 l 4.98 -2.561 a 0.7 0.7 0 0 1 1.02 0.623 v 11.7 a 0.7 0.7 0 0 1 -0.38 0.623 l -5.62 2.89 V 6.906 z"
//       />
//     </Base>
//   );
// };

Down.displayName = "IconChevronDown";
// Filled.displayName = "ChevronDownFilledIcon";
Path.displayName = "IconChevronDownPath";

// ChevronDown.Filled = Filled;
Down.Path = Path;
