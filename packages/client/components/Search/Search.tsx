import { Box } from "./Box";
import { Context } from "./Context";
import { Filters } from "./Filters";
import { Form } from "./Form";
// import { MapDialog } from "./MapDialog";
import { NearYou } from "./NearYou";
import { Recent } from "./Recent";
import { ShowInMap } from "./ShowInMap";

type SubComponents = {
  Box: typeof Box;
  Form: typeof Form;
  Context: typeof Context;
  Filters: typeof Filters;
  ShowInMap: typeof ShowInMap;
  Recent: typeof Recent;
  NearYou: typeof NearYou;
  // MapDialog: typeof MapDialog;
};

type Props = {};

const Search: React.FC<Props> & SubComponents = () => {
  return <div></div>;
};

Search.Box = Box;
Search.Form = Form;
Search.Context = Context;
Search.Filters = Filters;
Search.ShowInMap = ShowInMap;
Search.Recent = Recent;
Search.NearYou = NearYou;
// Search.MapDialog = MapDialog;

Search.displayName = "Search";

export default Search;
