import dayjs from "dayjs";
import range from "lodash/range";
import Section from "../Section";
import { Item } from "./__helpers__";

const RecentSearches: React.FC = () => {
  return (
    <section className="index__section__container">
      <Section.PageHeader header="Recent searches" link="View history" />
      <div className="index__section__list flex-row-center-flex-start">
        {range(0, 6).map(num => {
          return (
            <Item
              key={num}
              date={dayjs()}
              people={4}
              searchValue={num === 5 ? { beachBar: { name: "Seaside Paradise", thumbnailUrl: "" } } : "Kikabu"}
            />
          );
        })}
      </div>
    </section>
  );
};

RecentSearches.displayName = "RecentSearches";

export default RecentSearches;
