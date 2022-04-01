import { Details } from "./Details";
import { Food } from "./Food";
import { Images } from "./Images";
import { Photos } from "./Photos";
import { SearchInfo } from "./SearchInfo";

type SubComponents = {
  Images: typeof Images;
  Details: typeof Details;
  SearchInfo: typeof SearchInfo;
  Food: typeof Food;
  Photos: typeof Photos;
};

type Props = {};

const Page: React.FC<Props> & SubComponents = () => {
  return <div></div>;
};

Page.displayName = "BeachBarPage";

Page.Images = Images;
Page.Details = Details;
Page.SearchInfo = SearchInfo;
Page.Food = Food;
Page.Photos = Photos;

export default Page;
