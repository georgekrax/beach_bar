import { Header } from "./Header";
import { NameAndLocation } from "./NameAndLocation";
import { Review } from "./Review";
import { Favourite } from "./Favourite";

type SubComponents = {
  Header: typeof Header;
  Review: typeof Review;
  NameAndLocation: typeof NameAndLocation;
  Favourite: typeof Favourite;
};

export type Props = {};

const BeachBar: React.FC<Props> & SubComponents = () => {
  return <></>;
};

BeachBar.Header = Header;
BeachBar.Review = Review;
BeachBar.NameAndLocation = NameAndLocation;
BeachBar.Favourite = Favourite;

BeachBar.displayName = "BeachBar";

export default BeachBar;
