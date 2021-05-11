import { Crud } from "./Crud";

type SubComponents = {
  Crud: typeof Crud;
};

type Props = {};

const Header: React.FC<Props> & SubComponents = () => {
  return <div></div>;
};

Header.Crud = Crud;

Header.displayName = "Header";

export default Header;
