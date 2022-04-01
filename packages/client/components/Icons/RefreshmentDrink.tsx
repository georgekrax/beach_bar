import { Base, IconBaseFProps, IconPathBaseFProps, PathBase } from "./Base";

type SubComponents = {
  Colored: typeof Colored;
};

export const Glass: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      d="M11.4 7H9.2a1 1 0 00-1 .8l-.5 2.2M11.4 7h6.4a1 1 0 011 .8L19 9m-7.6-2a4 4 0 10-7.7-2m3.4 8.3.7-3.3m-.7 3.3A14.6 14.6 0 008.4 23h10.3a14.6 14.6 0 001.3-9.7L19.5 11M7.1 13.3c.8-.7 2.9-1.8 4.9-1c2.5 1 4 2 5.5 1.5c1.2-.4 2.1-1.4 2.2-1.7M7.7 10l0 0m0 0a4 4 0 01-3.4-1.5A4 4 0 013.6 5m0 0 4.1.8m0 0L6.5 2.5m1.3 3.3L5 8.5m2.7-2.7L10 3.5m6 3 .8-3.1L19.5 2M9 14c-.3.9-.5 3.5.8 7m4.8-1 1.4-1.4a1 1 0 000-1.4l-1.4-1.4a1 1 0 00-1.4 0l-1.4 1.4a1 1 0 000 1.4l1.4 1.4a1 1 0 001.4 0z"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    />
  );
};

export const IceCube2: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      d="M15 16.9a1 1 0 011.3-.6l1.9.7a1 1 0 01.6 1.3l-.7 1.9a1 1 0 01-1.3.6l-1.9-.7a1 1 0 01-.6-1.3l.7-1.9z"
      className="icon__filled--white"
      {...props}
    />
  );
};

export const IceCube1: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      d="M11.7 18.5a1 1 0 010-1.4l1.4-1.4a1 1 0 011.4 0l1.4 1.4a1 1 0 010 1.4l-1.4 1.4a1 1 0 01-1.4 0l-1.4-1.4z"
      {...props}
    />
  );
};

export const Liquid: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      d="M8.4 23h10.3c1.5-3 1.8-7.6 1.1-10.8c-.2.3-1 1.3-2.2 1.7c-1.5.5-3-.5-5.5-1.5c-2-.8-4.1.3-4.9 1A14.6 14.6 0 008.4 23z"
      {...props}
    />
  );
};

export const SlicedFruit: React.FC<IconPathBaseFProps> = ({ ...props }) => {
  return (
    <PathBase
      d="M11.4 7H9.2a1 1 0 00-1 .8l-.5 2.2a4 4 0 01-3.4-1.5A4 4 0 013.6 5a4 4 0 117.7 2z"
      {...props}
    />
  );
};

export const RefreshmentDrink: React.FC<IconBaseFProps> & SubComponents = ({ ...props }) => {
  return (
    <Base {...props}>
      <Glass />
      <IceCube2 />
    </Base>
  );
};

export const Colored: React.FC<IconBaseFProps> = ({ ...props }) => {
  return (
    <Base {...props}>
      <SlicedFruit className="icon__colored--refreshment-drink__sliced-fruit icon__stroke--none" />
      <Liquid className="icon__colored--refreshment-drink__liquid icon__stroke--none" />
      <IceCube1 className="icon__colored--refreshment-drink__ice-cube" />
      <Glass />
      <IceCube2 className="icon__colored--refreshment-drink__ice-cube" />
    </Base>
  );
};

RefreshmentDrink.displayName = "RefreshmentDrinkIcon";
Colored.displayName = "RefreshmentDrinkColoredIcon";
Glass.displayName = "RefreshmentDrinkGlassIcon";
IceCube2.displayName = "RefreshmentDrinkIceCube2Icon";
IceCube1.displayName = "RefreshmentDrinkIceCube1Icon";
Liquid.displayName = "RefreshmentDrinkLiquidIcon";
SlicedFruit.displayName = "SlicedFruitIcon";

RefreshmentDrink.Colored = Colored;
