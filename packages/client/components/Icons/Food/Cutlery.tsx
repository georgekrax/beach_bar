import { Base, IconBaseFProps, IconPathBaseFProps, PathBase } from "../Base";

type SubComponents = {
  Filled: typeof Filled;
  Colored: typeof Colored;
};

export const Vector: React.FC<IconPathBaseFProps> = ({ ...props }) => (
  <PathBase
    filled
    d="M6.44 10.25l-.34.36.34-.36zm3.13 0-.3-.4.3.4zM6 2a.5.5 0 00-1 0h1zm5 0a.5.5 0 00-1 0h1zM8.5 2a.5.5 0 00-1 0h1zM16 12.53v-.5h-.5v.5h.5zm-1.25 0h-.5v.5h.5v-.5zM18.5 2h.5v-.5h-.5V2zM8 21.5c-.27 0-.47-.08-.59-.2c-.12-.12-.23-.34-.23-.73h-1c0 .6.18 1.1.54 1.45c.35.34.82.48 1.29.48v-1zM6 8.95V7.39H5v1.56h1zm.1 1.67a.16.16 0 01.04.07c.02.05.04.14.04.3h1c0-.48-.12-.84-.4-1.1l-.69.73zM5 8.95c0 .45.23.8.45 1.05c.21.24.49.47.65.62l.69-.73c-.23-.21-.41-.36-.58-.55C6.05 9.16 6 9.04 6 8.95H5zM8 22.5c.53 0 1.02-.13 1.35-.52c.32-.37.4-.88.4-1.41h-1c0 .46-.08.67-.16.76c-.06.07-.2.17-.59.17v1zm3-13.71V7.39h-1v1.4h1zM9.26 9.85c-.14.11-.28.25-.37.45c-.1.2-.14.43-.14.68h1c0-.14.02-.21.04-.25a.22.22 0 01.07-.09l-.6-.8zM10 8.79c0 .38-.27.7-.74 1.06l.6.8C10.36 10.28 11 9.69 11 8.79h-1zM6 7.39V2H5v5.39h1zm5 0V2h-1v5.39h1zm-5.5.5H8v-1H5.5v1zm2.5 0h2.5v-1H8v1zm.5-.5V2h-1v5.39h1zm7.5 5.63h2.5v-1H16v1zm2-.5v8.42h1v-8.42h-1zm-1.5 8.42v-8.42h-1v8.42h1zm.84.55c-.58 0-.84-.35-.84-.55h-1c0 .96.95 1.55 1.84 1.55v-1zm.66-.55a.52.52 0 01-.15.38c-.09.09-.25.17-.51.17v1c.48 0 .9-.15 1.2-.45c.3-.29.46-.69.46-1.1h-1zm.5-8.92h-3.75v1h3.75v-1zm-3.25.5v-7.37h-1v7.37h1zM18 2v10.53h1V2h-1zm-2.75 3.16c0-1.4 1.25-2.66 3.25-2.66v-1c-2.41 0-4.25 1.57-4.25 3.66h1zM7.17 20.57v-8.04h-1v8.04h1zm0-8.04v-1.54h-1v1.54h1zM9.75 20.57v-8.04h-1v8.04h1zm0-8.04v-1.54h-1v1.54h1zm-3.08.5H9.25v-1H6.67v1z"
    {...props}
  />
);

export const FilledPath: React.FC<IconPathBaseFProps> = ({ ...props }) => (
  <PathBase
    filled
    d="M6.7 11v9.6c0 1 .6 1.4 1.3 1.4c.9 0 1.3-.4 1.3-1.4v-9.6c0-.4.1-.6.3-.7c.5-.4.9-.8.9-1.5V7.4h-5v1.6c0 .5.6.9.9 1.3c.1.1.2.3.2.7zM16 12.5h2.5v8.4c0 .6-.4 1.1-1.2 1.1S16 21.5 16 20.9v-8.4zM18.5 12.5h-3.8V5.2C14.8 3.4 16.3 2 18.5 2v10.5z"
    {...props}
  />
);

export const Tops: React.FC<IconPathBaseFProps> = ({ ...props }) => (
  <PathBase
    d="M18.5 12.5h-3.8V5.2C14.8 3.4 16.3 2 18.5 2v10.5zM5.5 7.4v1.6c0 .5.6.9.9 1.3c.1.1.2.3.2.7V12.5H9.3v-1.5c0-.4.1-.6.3-.7c.5-.4.9-.8.9-1.5V7.4h-5z"
    {...props}
  />
);

export const KniveBase: React.FC<IconPathBaseFProps> = ({ ...props }) => (
  <PathBase d="M16 12.5h2.5v8.4c0 .6-.4 1.1-1.2 1.1S16 21.5 16 20.9v-8.4z" {...props} />
);

export const ForkBase: React.FC<IconPathBaseFProps> = ({ ...props }) => (
  <PathBase d="M6.7 20.6c0 1 .6 1.4 1.3 1.4c.9 0 1.3-.4 1.3-1.4V12.5H6.7v8.1z" {...props} />
);

export const Cutlery: React.FC<IconBaseFProps> & SubComponents = ({ ...props }) => (
  <Base {...props}>
    <Vector />
  </Base>
);

export const Filled: React.FC<IconBaseFProps> = ({ ...props }) => (
  <Base {...props}>
    <Vector />
    <FilledPath />
  </Base>
);

export const Colored: React.FC<IconBaseFProps> = ({ ...props }) => (
  <Base {...props}>
    <KniveBase className="icon__colored--food-cutlery__knive-base icon__stroke--none" />
    <ForkBase className="icon__colored--food-cutlery__fork-base icon__stroke--none" />
    <Tops className="icon__colored--food-cutlery__tops icon__stroke--none" />
    <Vector />
  </Base>
);

Cutlery.displayName = "FoodCutleryIcon";
Filled.displayName = "FoodCutleryFilledIcon";
Colored.displayName = "FoodCutleryColoredIcon";
Vector.displayName = "FoodCutleryVectorIcon";
FilledPath.displayName = "FoodCutleryFilledPathIcon";
Tops.displayName = "FoodCutleryTopsIcon";
KniveBase.displayName = "FoodCutleryKniveBaseIcon";
ForkBase.displayName = "FoodCutleryForkBaseIcon";

Cutlery.Filled = Filled;
Cutlery.Colored = Colored;
