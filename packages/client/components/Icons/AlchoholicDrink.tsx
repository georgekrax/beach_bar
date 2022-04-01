import { Base, IconBaseFProps, IconPathBaseFProps, PathBase } from "./Base";

type SubComponents = {
  Colored: typeof Colored;
};

export const Vector: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      filled
      d="M13.2 20h-.5a.5.5 0 00.3.4l.2-.4zm4.3 2.1-.2.4 0 0 .2-.5zm-11 0 .2.5 0 0-.2-.4zm4.3-2.1.2.4a.5.5 0 00.3-.4h-.5zM20.2 5.1l-.4-.3.4.3zm-16.5 0-.4.3.4-.3zm5.3 7.3.4-.3-.4.3zm4.1 1.3-.2-.5.2.5zm1.7-1.3.4.3-.4-.3zm4.3-5.9.4.3-.4-.3zM17 2.4a.5.5 0 000 1v-1zm-2 1a.5.5 0 000-1v1zM8.7.8a.5.5 0 00-.9.4l.9-.4zm3.8 11.7a.5.5 0 10.9-.4l-.9.4zM10.3 16.8a.5.5 0 001 0h-1zm1 2a.5.5 0 10-1 0h1zm5.8-10.3a.5.5 0 10.8.6l-.8-.6zm-.4 2.2a.5.5 0 10-.8-.6l.8.6zM13 20.4l4.3 2.1.4-.9-4.3-2.1-.4.9zM17.3 22.5H6.7v1h10.6v-1zm-10.6 0 4.3-2.1-.4-.9-4.3 2.1.4.9zM6.7 22.5c0 0 0 0 0 0a.1.1 0 010 0c0 0 0 0 0 0c0 0 0 0 0 0a.1.1 0 010 0c0 0 0 0 0 0l-.4-.9c-.9.4-.6 1.8.4 1.8v-1zm10.6.1c0 0 0 0 0 0a.1.1 0 010 0c0 0 0 0 0 0c0 0 0 0 0 0a.1.1 0 010 0c0 0 0 0 0 0v1c1 0 1.4-1.4.4-1.9l-.4.9zm1.8-19.2c.8 0 1.2.8.8 1.4l.8.6c.9-1.3 0-3-1.6-3v1zM4.2 4.8c-.4-.6 0-1.4.8-1.4v-1c-1.5 0-2.5 1.7-1.6 3l.8-.6zm4.5 7.9c.5.7 1.2 1.2 1.9 1.5l.3-.9c-.5-.2-1.1-.6-1.5-1.2l-.8.6zm1.9 1.5a3.7 3.7 0 002.7-.1l-.4-.9a2.7 2.7 0 01-2 .1l-.3.9zm2.7-.1c.6-.3 1.5-.8 1.9-1.4l-.8-.6c-.3.4-1 .9-1.5 1.1l.4.9zm-.7-.5v6.3h1v-6.3h-1zm-3.2-1.6-4.3-5.9-.8.6 4.3 5.9.8-.6zm-4.3-5.9-1-1.4-.8.6 1 1.4.8-.6zm14.7-1.4-1 1.4.8.6 1-1.4-.8-.6zM4.8 6.9h5.7v-1H4.8v1zm5.7 0h8.8v-1h-8.8v1zM17 3.4h2.1v-1H17v1zm-12.1 0h4.1v-1H4.9v1zm4.1 0H15v-1H9v1zm-1.3-2.2.8 1.9.9-.4L8.7.8l-.9.4zm.8 1.9 1.5 3.5.9-.4L9.5 2.7l-.9.4zM11.3 16.8v-3.1h-1V16.8h1zm0 3.2V18.8h-1v1.2h1zm7.5-13.8-1.7 2.4.8.6 1.7-2.4-.8-.6zm-2.9 4-1.4 1.9.8.6 1.4-1.9-.8-.6zm-4.1.8c-.7 0-1.2-.5-1.2-1.2h-1c0 1.2 1 2.2 2.2 2.2v-1zm0-2.4c.7 0 1.2.5 1.2 1.2h1a2.2 2.2 0 00-2.2-2.2v1zm-1.2 1.2c0-.5.3-1 .8-1.1l-.3-.9A2.2 2.2 0 009.6 9.8h1zm.8-1.1c.1 0 .3-.1.4-.1v-1c-.3 0-.5 0-.8.1l.3.9zm-1.4-2 .7 1.8.9-.4-.7-1.8-.9.4zm2 4.9.4 1 .9-.4-.4-1-.9.4zm.9-1.7c0 .5-.3.9-.7 1.1l.4.9a2.2 2.2 0 001.3-2h-1zm-.7 1.1c-.2.1-.3.1-.5.1v1c.3 0 .6-.1.9-.2l-.4-.9z"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    />
  );
};

export const Glass: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      d="M13.2 20l4.3 2.1c.5.2.3.9-.2.9H6.7c-.5 0-.7-.7-.2-.9l4.3-2.1V13.7c-.6-.2-1.2-.7-1.7-1.3l-4.3-5.9-1-1.4c-.7-.9 0-2.2 1.2-2.2H19.1c1.2 0 1.8 1.3 1.2 2.2l-1 1.4-1.7 2.4-2.6 3.6c-.4.5-1.1 1-1.7 1.3v6.3z"
      {...props}
    />
  );
};

export const Liquid: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      d="M10.8 13.7c-.6-.2-1.2-.7-1.7-1.3l-4.3-5.9h14.5l-2.9 4-1.4 1.9c-.4.5-1.1 1-1.7 1.3a3.2 3.2 0 01-2.4.1z"
      {...props}
    />
  );
};

export const Olive: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return <PathBase d="M13.5 9.8a1.7 1.7 0 01-1.7 1.7a1.7 1.7 0 010-3.4c.9 0 1.7.8 1.7 1.7z" {...props} />;
};

export const AlchoholicDrink: React.FC<IconBaseFProps> & SubComponents = ({ ...props }) => {
  return (
    <Base {...props}>
      <Vector />
    </Base>
  );
};

export const Colored: React.FC<IconBaseFProps> = ({ ...props }) => {
  return (
    <Base {...props}>
      <Glass className="icon__colored--alchoholic-drink__glass icon__stroke--none" />
      <Liquid className="icon__colored--alchoholic-drink__liquid icon__stroke--none" />
      <Olive className="icon__colored--alchoholic-drink__olive icon__stroke--none" />
      <Vector />
    </Base>
  );
};

AlchoholicDrink.displayName = "AlchoholicDrinkIcon";
Colored.displayName = "AlchoholicDrinkColoredIcon";
Vector.displayName = "AlchoholicDrinkVectorIcon";
Glass.displayName = "AlchoholicDrinkGlassIcon";
Liquid.displayName = "AlchoholicDrinkLiquidIcon";
Olive.displayName = "AlchoholicDrinkOliveIcon";

AlchoholicDrink.Colored = Colored;
