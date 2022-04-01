import { Base, IconBaseFProps, IconPathBaseFProps, PathBase } from "./Base";

type SubComponents = {
  Colored: typeof Colored;
};

export const Cup: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      d="M2.8 2.8H2a1 1 0 00-1 1v.3a1 1 0 001 1h.3M2.8 2.8h1.3m-1.3 0V2a1 1 0 011-1h8.5a1 1 0 011 1v.8m0 0H14a1 1 0 011 1v.4a.9.9 0 01-.9.9M13.3 2.8H6.1M2.3 5l.4 1.8m-.4-1.8h11.8M2.8 6.8h10.9m-10.9 0a.7.7 0 00-.7.9l1.5 8.6c0 .3.3.4.5.4m9.6-9.9.4-1.8m-.4 1.8c.2 0 .4.2.4.4l-1.7 9.5m0 0-.6 1.6a1 1 0 01-.9.6H5.3a1 1 0 01-1-.8l-.3-1.4m8.3 0H10m-5.9 0H8m2.6-6.7c.8 1.1.3 2.8-1.1 3.7c-1.4.9-3.1.7-3.9-.4m5-3.3c-.8-1.1-2.5-1.3-3.9-.4c-1.4.9-1.9 2.6-1.1 3.7m5-3.3c-.5-.1-1.4.4-1.6 1c0 .1 0 .1-.1.2c-.1.3-.4.8-.9 1.2c-.7.4-1.8.8-2.4 1"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    />
  );
};

export const Seed: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      d="M14.6 12.1c.8 1.1.3 2.8-1.1 3.7c-1.4.9-3.1.7-3.9-.4c-.8-1.1-.3-2.8 1.1-3.7c1.4-.9 3.1-.7 3.9.4z"
      {...props}
    />
  );
};

export const Paper: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      d="M17.7 8.8H6.8a.7.7 0 00-.7.9l1.5 8.6c0 .3.3.4.5.4h7.5a1 1 0 001-.8l1.5-8.6a.4.4 0 00-.4-.4z"
      {...props}
    />
  );
};

export const Spoot: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      d="M6 4.8h.8V4a1 1 0 011-1h8.5a1 1 0 011 1v.8H18a1 1 0 011 1v.4a.9.9 0 01-.9.9H6a1 1 0 01-1-1V5.8a1 1 0 011-1"
      {...props}
    />
  );
};

export const Coffee: React.FC<IconBaseFProps> & SubComponents = ({ ...props }) => {
  return (
    <Base {...props}>
      <Cup />
    </Base>
  );
};

export const Colored: React.FC<IconBaseFProps> = ({ ...props }) => {
  return (
    <Base {...props}>
      <Paper className="icon__colored--coffee__paper icon__stroke--none" />
      <Spoot className="icon__colored--coffee__spoot icon__stroke--none" />
      <Seed className="icon__colored--coffee__seed icon__stroke--none" />
      <Cup d="M6.8 4.8H6a1 1 0 00-1 1v.3a1 1 0 001 1h.3M6.8 4.8h1.3m-1.3 0V4a1 1 0 011-1h8.5a1 1 0 011 1v.8m0 0H18a1 1 0 011 1v.4a.9.9 0 01-.9.9M17.3 4.8h-7.2M6.3 7l.4 1.8m-.4-1.8h11.8M6.8 8.8h10.9m-10.9 0a.7.7 0 00-.7.9l1.5 8.6c0 .3.3.4.5.4m9.6-9.9.4-1.8m-.4 1.8c.2 0 .4.2.4.4l-1.7 9.5m0 0-.6 1.6a1 1 0 01-.9.6H9.3a1 1 0 01-1-.8l-.3-1.4m8.3 0H14m-5.9 0H12m2.6-6.7c.8 1.1.3 2.8-1.1 3.7c-1.4.9-3.1.7-3.9-.4m5-3.3c-.8-1.1-2.5-1.3-3.9-.4c-1.4.9-1.9 2.6-1.1 3.7m5-3.3c-.5-.1-1.4.4-1.6 1c0 .1 0 .1-.1.2c-.1.3-.4.8-.9 1.2c-.7.4-1.8.8-2.4 1" />
    </Base>
  );
};

Coffee.displayName = "CoffeeIcon";
Colored.displayName = "CoffeeColoredIcon";
Cup.displayName = "CoffeeCupIcon";
Seed.displayName = "CoffeeSeedIcon";
Paper.displayName = "CoffeePaperIcon";
Spoot.displayName = "CoffeeSpootIcon";

Coffee.Colored = Colored;
