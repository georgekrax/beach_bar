import { Box } from "./Box";
import { Context } from "./Context";
import { Form } from "./Form";
import { Filters } from "./Filters";

type SubComponents = {
  Box: typeof Box;
  Form: typeof Form;
  Context: typeof Context;
  Filters: typeof Filters;
};

type Props = {};

const Search: React.FC<Props> & SubComponents = () => {
  return <div></div>;
};

Search.Box = Box;
Search.Form = Form;
Search.Context = Context;
Search.Filters = Filters;

Search.displayName = "Search";

export default Search;
