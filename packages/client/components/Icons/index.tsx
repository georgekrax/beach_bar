import { Base, PathBase } from "./Base";
import Map from "./Map";
import Search from "./Search";
import ShoppingCart from "./ShoppingCart";
import TapBarIndicator from "./TapBarIndicator";
import UserAvatar from "./UserAvatar";

type SubComponents = {
  Base: typeof Base;
  PathBase: typeof PathBase;
  Search: typeof Search;
  Map: typeof Map;
  ShoppingCart: typeof ShoppingCart;
  UserAvatar: typeof UserAvatar;
  TapBarIndicator: typeof TapBarIndicator;
};

const Icons: React.FC & SubComponents = () => {
  return <></>;
};

Icons.displayName = "Icons";

Icons.Search = Search;
Icons.Base = Base;
Icons.PathBase = PathBase;
Icons.Map = Map;
Icons.ShoppingCart = ShoppingCart;
Icons.UserAvatar = UserAvatar;
Icons.TapBarIndicator = TapBarIndicator;

export default Icons;

export { TapBarIndicatorIconPath } from "./TapBarIndicator";
