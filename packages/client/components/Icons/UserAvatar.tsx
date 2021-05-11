import { Base, IconBaseFProps, IconPathBaseFProps, PathBase } from "./Base";

type SubComponents = {
  Filled: typeof Filled;
};

export const Path: React.FC<IconPathBaseFProps> = props => {
  return (
    <PathBase
      d="M 16 7 a 4 4 0 1 1 -8 0 a 4 4 0 0 1 8 0 z M 16.99 21 H 6.88 c -1.52 0 -2.71 -1.35 -2.36 -2.83 c 0.66 -2.77 1.55 -4.16 2.64 -4.81 c 0.5 -0.29 1.12 -0.17 1.63 0.09 c 0.92 0.46 2.35 1.06 3.2 1.06 c 0.92 0 2.47 -0.68 3.38 -1.15 c 0.41 -0.21 0.88 -0.35 1.33 -0.22 c 2.15 0.59 2.69 2.76 2.95 4.88 c 0.19 1.55 -1.1 2.99 -2.66 2.99 z"
      {...props}
    />
  );
};

const UserAvatar: React.FC<IconBaseFProps> & SubComponents = props => {
  return (
    <Base {...props}>
      <Path />
    </Base>
  );
};

export const Filled: React.FC<IconBaseFProps> = props => {
  return (
    <Base {...props}>
      <Path filled />
    </Base>
  );
};

UserAvatar.displayName = "UserAvatarIcon";
Filled.displayName = "UserAvatarFilledIcon";

UserAvatar.Filled = Filled;

export default UserAvatar;