import { Base, IconBaseFProps, IconPathBaseFProps, PathBase } from "./Base";

type SubComponents = {
  Filled: typeof Filled;
  Path: typeof Path;
};

export const Path: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      d="M 8 17.4 l -5.251 2.7 A 1.2 1.2 0 0 1 1 19.034 v -11.7 c 0 -0.45 0.251 -0.862 0.651 -1.068 L 8 3 m 0 14.4 l 8 3.6 m -8 -3.6 V 3 m 8 18 l 6.349 -3.265 A 1.2 1.2 0 0 0 23 16.668 V 4.967 a 1.2 1.2 0 0 0 -1.749 -1.068 L 16 6.6 M 16 21 V 6.6 m 0 0 L 8 3"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    />
  );
};

const Map: React.FC<IconBaseFProps> & SubComponents = ({ ...props }) => {
  return (
    <Base {...props}>
      <Path />
    </Base>
  );
};

export const Filled: React.FC<IconBaseFProps> = ({ ...props }) => {
  return (
    <Base {...props}>
      <Path
        filled
        d="M 7.5 17.095 l -4.98 2.561 a 0.7 0.7 0 0 1 -1.02 -0.622 V 7.332 a 0.7 0.7 0 0 1 0.38 -0.622 L 7.5 3.82 v 13.275 z m 1 -13.322 l 7 3.15 v 13.304 l -7 -3.15 V 3.773 z m 8 3.132 l 4.98 -2.561 a 0.7 0.7 0 0 1 1.02 0.623 v 11.7 a 0.7 0.7 0 0 1 -0.38 0.623 l -5.62 2.89 V 6.906 z"
      />
    </Base>
  );
};

Map.displayName = "MapIcon";
Filled.displayName = "MapFilledIcon";
Path.displayName = "MapPathIcon";

Map.Filled = Filled;
Map.Path = Path;

export default Map;
