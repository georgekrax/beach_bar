import { Base, CircleBase, IconBaseFProps, IconPathBaseFProps, PathBase, IconCircleBaseFProps } from "../Base";

type SubComponents = {
  // Filled: typeof Filled;
  Path: typeof Path;
  Circle: typeof Circle;
};

export const Path: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      d="M17.1 15L17.8 14C19.7 11.2 19.3 7.4 16.9 5.1C14.2 2.3 9.8 2.3 7 5C4.7 7.4 4.3 11.2 6.3 13.9L11.8 21.9C11.9 22 12.1 22 12.2 21.9L14.6 18.4"
      strokeLinecap="round"
      {...props}
    />
  );
};

export const Circle: React.FC<IconCircleBaseFProps> = ({ ...props }) => {
  return <CircleBase cx="12" cy="10" r="3" fill="black" {...props} />;
};

export const DotCropped: React.FC<IconBaseFProps> & SubComponents = ({ ...props }) => {
  return (
    <Base {...props}>
      <Path />
      <Circle />
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

DotCropped.displayName = "MapMarkerDotCroppedIcon";
Path.displayName = "MapMarkerDotCroppedPathIcon";
Circle.displayName = "MapMarkerDotCroppedCircleIcon";

DotCropped.Path = Path;
DotCropped.Circle = Circle;
