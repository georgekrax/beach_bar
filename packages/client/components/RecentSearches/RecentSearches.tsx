import { BeachBar } from "@/graphql/generated";
import Section from "../Section";
import { Item, RecentSearchesItemProps } from "./__helpers__";

export type Props = {
  beachBars: (RecentSearchesItemProps & Pick<BeachBar, "id">)[];
};

const RecentSearches: React.FC<Props> = ({ beachBars }) => {
  return beachBars.length > 0 ? (
    <section className="index__section__container">
      {/* TODO: Change pathname later */}
      <Section.Header href={{ pathname: "/" }} link="View history">
        Recent searches
      </Section.Header>
      <div className="index__section__list flex-row-center-flex-start">
        {beachBars.map(({ id, date, people, searchValue }) => {
          return <Item key={id} date={date} people={people} searchValue={searchValue} />;
        })}
      </div>
    </section>
  ) : null;
};

RecentSearches.displayName = "RecentSearches";

export default RecentSearches;
