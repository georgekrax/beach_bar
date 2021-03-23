import { Base, IconBaseFProps, IconPathBaseFProps, PathBase } from "./Base";

type SubComponents = {
  Path: typeof Path;
  Filled: typeof Filled;
  Colored: typeof Colored;
  HalfColored: typeof HalfColored;
};

const Path: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      d="M11.6 3.2C11.7 2.8 12.3 2.8 12.4 3.2L14.2 8.6C14.2 8.8 14.4 8.9 14.5 8.9H20.3C20.7 8.9 20.8 9.4 20.5 9.6L15.9 13C15.7 13.1 15.7 13.3 15.7 13.5L17.5 18.9C17.6 19.3 17.2 19.6 16.9 19.4L12.2 16C12.1 15.9 11.9 15.9 11.8 16L7.1 19.4C6.8 19.6 6.4 19.3 6.5 18.9L8.3 13.5C8.3 13.3 8.3 13.1 8.1 13L3.5 9.6C3.2 9.4 3.3 8.9 3.7 8.9H9.5C9.6 8.9 9.8 8.8 9.8 8.6L11.6 3.2Z"
      strokeLinecap="round"
      {...props}
    />
  );
};

export const Star: React.FC<IconBaseFProps> & SubComponents = ({ ...props }) => {
  return (
    <Base {...props}>
      <Path />
    </Base>
  );
};

const Filled: React.FC<IconBaseFProps> = ({ ...props }) => {
  return (
    <Base {...props}>
      <Path filled />
    </Base>
  );
};

const Colored: React.FC<IconBaseFProps> = ({ ...props }) => {
  return (
    <Base {...props}>
      <Path className="icon-star--filled" />
    </Base>
  );
};

const HalfColored: React.FC<IconBaseFProps> = ({ ...props }) => {
  return (
    <Base {...props}>
      <g clipPath="url(#prefix__clip0)">
        <path
          d="M11.5 1.4a.5.5 0 01.9 0l2.1 6.6a.5.5 0 00.5.3h6.9a.5.5 0 01.3.9l-5.6 4.1a.5.5 0 00-.2.5l2.1 6.6a.5.5 0 01-.7.5l-5.6-4.1a.5.5 0 00-.6 0l-5.6 4a.5.5 0 01-.7-.5l2.1-6.6a.5.5 0 00-.2-.5l-5.6-4a.5.5 0 01.3-.9h6.9a.5.5 0 00.5-.3l2.1-6.6z"
          className="icon-star--grey"
        />
        <g clipPath="url(#prefix__clip1)">
          <path
            d="M11.5 1.4a.5.5 0 01.9 0l2.1 6.6a.5.5 0 00.5.3h6.9a.5.5 0 01.3.9l-5.6 4.1a.5.5 0 00-.2.5l2.1 6.6a.5.5 0 01-.7.5l-5.6-4.1a.5.5 0 00-.6 0l-5.6 4a.5.5 0 01-.7-.5l2.1-6.6a.5.5 0 00-.2-.5l-5.6-4a.5.5 0 01.3-.9h6.9a.5.5 0 00.5-.3l2.1-6.6z"
            className="icon-star--filled"
          />
        </g>
      </g>
      <defs>
        <clipPath id="prefix__clip0">
          <path d="M0 0h24v24H0z" />
        </clipPath>
        <clipPath id="prefix__clip1">
          <path transform="translate(1 1)" d="M0 0h11v20H0z" />
        </clipPath>
      </defs>
    </Base>
  );
};

Star.displayName = "IconStar";
Path.displayName = "IconStarPath";
Filled.displayName = "IconStarFilled";
Colored.displayName = "IconStarColored";
HalfColored.displayName = "HalfColored";

Star.Path = Path;
Star.Filled = Filled;
Star.Colored = Colored;
Star.HalfColored = HalfColored;
