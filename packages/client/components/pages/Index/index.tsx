import { Header } from "./Header";

type SubComponents = {
  Header: typeof Header;
};

const IndexPage: React.FC & SubComponents = () => {
  return <></>;
};

IndexPage.Header = Header;

IndexPage.displayName = "IndexPage";

export default IndexPage;
