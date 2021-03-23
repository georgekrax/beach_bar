import { Add } from "./Add";
import { Arrow } from "./Arrow";
import { Base, PathBase } from "./Base";
import Bookmark from "./Bookmark";
import { Checkmark } from "./Checkmark";
import Chevron from "./Chevron";
import { Close } from "./Close";
import { Edit } from "./Edit";
import { Face } from "./Face";
import Filters from "./Filters";
import { Flame } from "./Flame";
import { Logo } from "./Logo";
import Map from "./Map";
import MapMarker from "./MapMarker";
import { Save } from "./Save";
import { Heart } from "./Heart";
import { Search } from "./Search";
import ShoppingCart from "./ShoppingCart";
import { Star } from "./Star";
import TapBarIndicator from "./TapBarIndicator";
import { Thumb } from "./Thumb";
import { Navigation } from "./Navigation";
import UserAvatar from "./UserAvatar";

type SubComponents = {
  Base: typeof Base;
  PathBase: typeof PathBase;
  Search: typeof Search;
  Map: typeof Map;
  ShoppingCart: typeof ShoppingCart;
  UserAvatar: typeof UserAvatar;
  TapBarIndicator: typeof TapBarIndicator;
  Chevron: typeof Chevron;
  Filters: typeof Filters;
  MapMarker: typeof MapMarker;
  Close: typeof Close;
  Bookmark: typeof Bookmark;
  Logo: typeof Logo;
  Flame: typeof Flame;
  Edit: typeof Edit;
  Save: typeof Save;
  Add: typeof Add;
  Arrow: typeof Arrow;
  Checkmark: typeof Checkmark;
  Thumb: typeof Thumb;
  Face: typeof Face;
  Star: typeof Star;
  Heart: typeof Heart;
  Navigation: typeof Navigation;
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
Icons.Chevron = Chevron;
Icons.Filters = Filters;
Icons.MapMarker = MapMarker;
Icons.Close = Close;
Icons.Bookmark = Bookmark;
Icons.Logo = Logo;
Icons.Flame = Flame;
Icons.Edit = Edit;
Icons.Save = Save;
Icons.Add = Add;
Icons.Arrow = Arrow;
Icons.Checkmark = Checkmark;
Icons.Thumb = Thumb;
Icons.Face = Face;
Icons.Star = Star;
Icons.Heart = Heart;
Icons.Navigation = Navigation;

export default Icons;

export { TapBarIndicatorIconPath } from "./TapBarIndicator";
