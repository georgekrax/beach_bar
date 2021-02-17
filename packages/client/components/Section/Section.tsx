import PageHeader from "./PageHeader";

type SubComponents = {
  PageHeader: typeof PageHeader;
}

export type Props = {

}

const Section: React.FC<Props> & SubComponents = () => {
  return (
    <div>

    </div>
  );
};

Section.displayName = "Section"

Section.PageHeader = PageHeader;

export default Section;