import { Base, CircleBase, IconBaseFProps, IconPathBaseFProps, PathBase } from "./Base";

type SubComponents = {
  Colored: typeof Colored;
};

export const Can: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      filled
      d="M6 7l-.43-.25A.5.5 0 005.5 7H6zm12 0h.5v-.13l-.07-.12L18 7zM6 17h-.5a.5.5 0 00.07.25L6 17zm12 0 .43.25A.5.5 0 0018.5 17H18zm-8.5.5a.5.5 0 000-1v1zm2-1a.5.5 0 000 1v-1zm-4.36 2.49-.43.25.43-.25zm9.72 0 .43.25-.43-.25zm0-13.98.43-.25-.43.25zm-9.72 0 .43.25-.43-.25zM6 8.9a.5.5 0 000 1v-1zm3.15 1.45a.5.5 0 00.71-.71l-.71.71zm6.19 1.78a.5.5 0 00-.68.74l.68-.74zM18 14.5a.5.5 0 000-1v1zM6 12a.5.5 0 100 1v-1zm2.72.91a.5.5 0 10.57-.82l-.57.82zm5.32 1.28a.5.5 0 00-.68.74l.68-.74zM18 16.5a.5.5 0 000-1v1zm-2.7-5.67a.5.5 0 10-.94.33l.94-.33zM13 9.19l.17-.47-.17.47zm.14.6a.5.5 0 10.44-.9l-.44.9zM6.5 20.5h11v-1h-11v1zm11 2h-11v1h11v-1zm-11 0a1 1 0 01-1-1h-1a2 2 0 002 2v-1zm12-1a1 1 0 01-1 1v1a2 2 0 002-2h-1zm-1-1a1 1 0 011 1h1a2 2 0 00-2-2v1zm-11-1a2 2 0 00-2 2h1a1 1 0 011-1v-1zm11-16h-11v1h11v-1zm-11 0a1 1 0 01-1-1h-1a2 2 0 002 2v-1zm12-1a1 1 0 01-1 1v1a2 2 0 002-2h-1zm1 0a2 2 0 00-2-2v1a1 1 0 011 1h1zm-14 0a1 1 0 011-1v-1a2 2 0 00-2 2h1zm3.38 2h6.25v-1h-6.25v1zm6.25 15h-6.25v1h6.25v-1zM6.43 7.25l1.14-1.99-.87-.5-1.14 1.99.87.5zm9.99-1.99 1.14 1.99.87-.5-1.14-1.99-.87.5zM7.57 18.74l-1.14-1.99-.87.5 1.14 1.99.87-.5zM6.5 17V7h-1v10h1zm11-10v10h1V7h-1zm.07 9.75-1.14 1.99.87.5 1.14-1.99-.87-.5zM6 7.5h12v-1H6v1zm0 10h3.5v-1H6v1zm5.5 0H18v-1h-6.5v1zm-2.63 2a1.5 1.5 0 01-1.3-.76l-.87.5a2.5 2.5 0 002.17 1.26v-1zm6.25 1a2.5 2.5 0 002.17-1.26l-.87-.5a1.5 1.5 0 01-1.3.76v1zm0-16a1.5 1.5 0 011.3.76l.87-.5a2.5 2.5 0 00-2.17-1.26v1zm-6.25-1a2.5 2.5 0 00-2.17 1.26l.87.5A1.5 1.5 0 018.88 4.5v-1zM6 9.9c.53 0 1.26.03 1.91.11c.32.04.61.1.84.17c.25.07.36.14.39.18l.71-.71c-.22-.21-.53-.34-.81-.43a6.5 6.5 0 00-1-.2A16.73 16.73 0 006 8.9v1zm8.66 2.97c.33.3 1.03.7 1.66 1.02c.32.16.65.31.92.42c.14.05.27.1.39.14c.11.03.24.06.37.06v-1c.02 0 0 0-.09-.02a3.6 3.6 0 01-.3-.11a10.88 10.88 0 01-.84-.38c-.63-.31-1.21-.66-1.43-.86l-.68.74zM6 13c.29 0 .58-.04.86-.07c.29-.04.54-.09.8-.12c.54-.06.86-.03 1.06.1l.57-.82c-.53-.36-1.21-.33-1.74-.27c-.28.03-.57.08-.83.12A5.17 5.17 0 016 12v1zm7.36 1.93c.12.11.28.2.43.28c.16.08.35.17.56.25c.41.17.9.33 1.39.48c.48.15.96.29 1.36.39c.2.05.37.09.52.12c.13.03.27.05.39.05v-1c0 0-.05 0-.19-.03c-.12-.02-.28-.06-.47-.11c-.37-.09-.83-.22-1.3-.37a18.33 18.33 0 01-1.31-.46a5.88 5.88 0 01-.48-.21a1.16 1.16 0 01-.21-.13l-.68.74zM14.5 12a2.5 2.5 0 01-2.5 2.5v1a3.5 3.5 0 003.5-3.5h-1zM12 14.5A2.5 2.5 0 019.5 12h-1a3.5 3.5 0 003.5 3.5v-1zM9.5 12A2.5 2.5 0 0112 9.5v-1A3.5 3.5 0 008.5 12h1zm4.86-.83c.09.26.14.54.14.83h1c0-.41-.07-.8-.2-1.17l-.94.33zM6.5 1.5h11v-1h-11v1zm5.5 8c.2 0 .5.04.83.16l.33-.94A3.63 3.63 0 0012 8.5v1zm.83.16c.1.04.2.08.31.13l.44-.9a3.84 3.84 0 00-.42-.17l-.33.94z"
      {...props}
    />
  );
};

export const Circle: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return <CircleBase cx={13.75} cy={9.5} r={0.5} filled {...props} />;
};

export const Brand: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return <PathBase d="M12 15a3 3 0 002.83-4c-.11-.667-.83-2-2.83-2a3 3 0 100 6z" {...props} />;
};

export const Lane: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      d="M18 16v-2c-.4 0-2.5-1-3-1.5c0 .5-.4 1.6-1.3 2C14.2 15 17.6 16 18 16zM9.7 10.1c-.5-.5-2.6-.7-3.7-.7v3.1c1 0 2.3-.4 3 .1c0 0 0-.3-.1-.6c0-.5.1-1.5.7-1.9z"
      {...props}
    />
  );
};

export const Sticker: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return <PathBase d="M6 7v10h12V7H6z" {...props} />;
};

export const StickerEdges: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      d="M7.1 5A2 2 0 018.9 4h6.3a2 2 0 011.7 1L18 7v10l-1.1 2A2 2 0 0115.1 20h-6.3a2 2 0 01-1.7-1L6 17V7l1.1-2z"
      {...props}
    />
  );
};

export const Spoot: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      d="M5 21.5A1.5 1.5 0 016.5 20h11a1.5 1.5 0 010 3h-11A1.5 1.5 0 015 21.5zM5 2.5A1.5 1.5 0 016.5 1h11a1.5 1.5 0 010 3h-11A1.5 1.5 0 015 2.5z"
      {...props}
    />
  );
};

export const SoftDrink: React.FC<IconBaseFProps> & SubComponents = ({ ...props }) => {
  return (
    <Base {...props}>
      <Circle />
      <Can />
    </Base>
  );
};

export const Colored: React.FC<IconBaseFProps> = ({ ...props }) => {
  return (
    <Base className="icon__stroke--none__path" {...props}>
      <Spoot className="icon__colored--soft-drink__spoot" />
      <StickerEdges className="icon__colored--soft-drink__sticker-edges" />
      <Sticker className="icon__colored--soft-drink__sticker" />
      <Lane className="icon__colored--soft-drink__lane" />
      <Brand className="icon__colored--soft-drink__brand" />
      <Circle />
      <Can />
    </Base>
  );
};

SoftDrink.displayName = "SoftDrinkIcon";
Colored.displayName = "SoftDrinkColoredIcon";
Can.displayName = "SoftDrinkCanIcon";
Circle.displayName = "SoftDrinkCircleIcon";
Brand.displayName = "SoftDrinkBrandIcon";
Lane.displayName = "SoftDrinkLaneIcon";
Sticker.displayName = "StickerIcon";
StickerEdges.displayName = "StickerEdgesIcon";
Spoot.displayName = "SoftDrinkSpootIcon";

SoftDrink.Colored = Colored;
