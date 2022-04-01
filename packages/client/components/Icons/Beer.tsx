import { Base, IconBaseFProps, IconPathBaseFProps, PathBase } from "./Base";

type SubComponents = {
  Colored: typeof Colored;
};

export const Vector: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      filled
      d="M11 5.8v-.5a.5.5 0 00-.5.5h.5zm-2 0h.5a.5.5 0 00-.5-.5v.5zm-1.3 7.3.5-.1-.5.1zm-.5-2.4-.5.1.5-.1zm8.9 3.8-.5-.1a.5.5 0 000 .1l.5 0zM16 15.4l-.5 0v0l.5 0zm-7.5 6.6.5 0-.5 0zm0-.9-.5 0 .5 0zm-.1-3.3.5 0-.5 0zm7.2 4.2.5 0-.5 0zm1.3-11.4.5.1-.5-.1zM8 4l-.2.5a.5.5 0 00.7-.4L8 4zm2.3-1.5-.1.5a.5.5 0 00.5-.2l-.4-.2zm5-.4-.4.3a.5.5 0 00.6.2l-.2-.5zM15 5.8v-.5a.5.5 0 00-.5.5h.5zm-2 0h.5a.5.5 0 00-.5-.5v.5zm-2 15.9a.5.5 0 000-1v1zm2-1a.5.5 0 100 1v-1zM10.5 5.8V9.5h1V5.8h-1zm0 3.8V11h1V9.5h-1zm-1 1.5V9.5h-1V11h1zm0-1.5V5.8h-1V9.5h1zm.5 2a.5.5 0 01-.5-.5h-1a1.5 1.5 0 001.5 1.5v-1zm.5-.5a.5.5 0 01-.5.5v1a1.5 1.5 0 001.5-1.5h-1zm4.1 11.5H9.5v1h5.1v-1zm-6.3-9.6-.5-2.4-1 .2.5 2.4 1-.2zm7.4 1.5-.1.9 1 .1.1-.9-1-.1zM7.5 9.5V6.8h-1V9.5h1zm9-2.8V9.5h1V6.8h-1zM9 22l0-.9-1 0 0 .9 1 0zm0-.9L8.8 17.8l-1 0 .1 3.3 1 0zm6.2 0-.1 1 1 .1.1-1-1-.1zM16.5 9.5c0 .3 0 .4 0 .5c0 .1-.1.3-.1.6l1 .2c.1-.3.1-.4.1-.6c0-.2.1-.4.1-.7h-1zm-8.8 1.1c-.1-.3-.1-.5-.2-.6c0-.1 0-.2 0-.5h-1c0 .3 0 .5.1.7c.1.2.1.2.1.6l1-.2zm-.5 2.6a25.9 25.9 0 01.6 4.7l1 0a26.9 26.9 0 00-.6-4.9l-1 .2zM9.5 22.5a.5.5 0 01-.5-.5l-1 0a1.5 1.5 0 001.5 1.5v-1zm5.1 1a1.5 1.5 0 001.5-1.4l-1-.1a.5.5 0 01-.5.5v1zM16 6.3a.5.5 0 01.5.5h1a1.5 1.5 0 00-1.5-1.5v1zm-8-1a1.5 1.5 0 00-1.5 1.5h1a.5.5 0 01.5-.5v-1zm-1.5.1a1 1 0 011-1v-1a2 2 0 00-2 2h1zM16 2.5A1.5 1.5 0 0117.5 4h1A2.5 2.5 0 0016 1.5v1zM8.5 4.1C8.7 3.5 9.2 3 10 3V2c-1.2 0-2.2.7-2.5 1.9l1 .2zm-1 .2c0 0 0 0 .1 0c0 0 .1 0 .1.1c0 0 .1.1.2.1l.4-.9a1.1 1.1 0 01-.1 0c0 0-.1 0-.1-.1A1.2 1.2 0 007.5 3.3v1zm3.3-1.5A2.5 2.5 0 0113 1.5v-1a3.5 3.5 0 00-3.1 1.8l.9.5zM10 3c.1 0 .2 0 .3 0l.2-1A2.5 2.5 0 0010 2v1zm5.5-.4c.2-.1.3-.1.5-.1v-1c-.3 0-.6.1-.8.1l.3.9zM13 1.5c.8 0 1.5.4 1.9.9l.8-.6A3.5 3.5 0 0013 .5v1zM17.5 4c0 .2-.1.5-.4.9c-.2.3-.5.6-.7.7l.5.9c.4-.2.8-.6 1.1-1c.3-.4.5-.9.5-1.4h-1zM7.2 6.3C6.8 6.1 6.5 5.7 6.5 5.3h-1c0 .9.5 1.6 1.3 1.9l.3-.9zM8 6.3h1v-1H8v1zM7 10h2V9H7v1zm4 0h6V9h-6v1zm3.5-4.3V7h1V5.8h-1zM13.5 7V5.8h-1V7h1zm.5.5a.5.5 0 01-.5-.5h-1A1.5 1.5 0 0014 8.5v-1zm.5-.5a.5.5 0 01-.5.5v1A1.5 1.5 0 0015.5 7h-1zM11 6.3h2v-1h-2v1zm4 0h1v-1h-1v1zM8.4 21.6H11v-1H8.4v1zm4.6 0h2.6v-1H13v1zm3.3-11-.7 3.8 1 .2.7-3.8-1-.2zm-.8 4.8-.4 5.7 1 .1.4-5.7-1-.1z"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    />
  );
};

export const Mounting: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return <PathBase d="M9.5 23h5.1a1 1 0 001-.9a.9.9 0 00-.9-1H9.4a.9.9 0 00-.9.9a1 1 0 001 1z" {...props} />;
};

export const Foam: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      d="M11 9.5V5.8h2V7a1 1 0 102 0V5.8h1c.6 0 .7.3.7.3C17.3 5.7 18 4.7 18 4a2 2 0 00-2.7-1.9a3 3 0 00-5 .4A2 2 0 0010 2.5c-1 0-1.8.6-2 1.5c-.2-.1-.3-.2-.5-.2A1.5 1.5 0 006 5.3c0 .7.4 1.2 1 1.4a1 1 0 011-1h1V11a1 1 0 102 0V9.5z"
      {...props}
    />
  );
};

export const Glass: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      d="M9 9.5h6.8c.7 0 1.1.5 1 1.2l-.7 3.8-.1.9-.4 5.7-.1 1a1 1 0 01-1 .9H9.5a1 1 0 01-1-1l0-.9-.1-3.3a26.4 26.4 0 00-.6-4.8l-.5-2.4c-.1-.6.3-1.2 1-1.2H9z"
      {...props}
    />
  );
};

export const Spoot: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return <PathBase d="M7 6.8V9.5h10V6.8a1 1 0 00-1-1H8a1 1 0 00-1 1z" {...props} />;
};

export const Beer: React.FC<IconBaseFProps> & SubComponents = ({ ...props }) => {
  return (
    <Base {...props}>
      <Vector />
    </Base>
  );
};

export const Colored: React.FC<IconBaseFProps> = ({ ...props }) => {
  return (
    <Base {...props}>
      <Spoot className="icon__colored--beer__spoot icon__stroke--none" />
      <Glass className="icon__colored--beer__glass icon__stroke--none" />
      <Foam className="icon__colored--beer__foam icon__stroke--none" />
      <Mounting className="icon__colored--beer__mounting icon__stroke--none" />
      <Vector />
    </Base>
  );
};

Beer.displayName = "BeerIcon";
Colored.displayName = "BeerColoredIcon";
Vector.displayName = "BeerVectorIcon";
Mounting.displayName = "BeerMountingIcon";
Foam.displayName = "BeerFoamIcon";
Glass.displayName = "BeerGlassIcon";
Spoot.displayName = "BeerSpootIcon";

Beer.Colored = Colored;
