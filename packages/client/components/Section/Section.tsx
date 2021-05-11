import { Header } from "./Header/Header";
import { PageHeader } from "./PageHeader/PageHeader";

type SubComponents = {
  Header: typeof Header;
  PageHeader: typeof PageHeader;
};

export type Props = {};

const Section: React.FC<Props> & SubComponents = () => {
  return <div></div>;
};

Section.displayName = "Section";

Section.Header = Header;
Section.PageHeader = PageHeader;

export default Section;
