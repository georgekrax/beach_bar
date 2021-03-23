import { DAY_NAMES_ARR, MONTHS } from "@the_hashtag/common";
import dayjs, { Dayjs } from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { groupBy } from "lodash";
import { GetServerSideProps } from "next";
import { useMemo } from "react";
import { Toaster } from "react-hot-toast";
import Account from "../../components/Account";
import Layout from "../../components/Layout";
import Next from "../../components/Next";
import { UserHistoryDocument, UserHistoryQuery, useUserHistoryQuery } from "../../graphql/generated";
import { initializeApollo, INITIAL_APOLLO_STATE } from "../../lib/apollo";
import { getAuth } from "../../lib/auth";
import { useAuth } from "../../utils/hooks";

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

const History: React.FC = () => {
  const {
    data: { me },
  } = useAuth();
  const doNotAllow = useMemo(() => !me.account.trackHistory, [me]);
  const { data, loading, error } = useUserHistoryQuery({ skip: doNotAllow });

  const parseWeekDate = (day: Dayjs) => {
    return `${DAY_NAMES_ARR.find(({ id }) => id === day.day())?.name.substring(0, 3)} ${day.date()} ${MONTHS[
      day.month()
    ]?.substring(0, 3)}`;
  };

  const sortedData: [string, UserHistoryQuery["userHistory"]][] = useMemo(() => {
    if (!data?.userHistory) return [];
    const weeksObj = groupBy(data.userHistory, dt => dayjs(dt.userHistory.timestamp).week());
    return Object.entries(weeksObj)
      .filter(([_, val]) => val.some(({ beachBar, search }) => beachBar || search))
      .map(([key, val]) => {
        const day = dayjs().week(parseInt(key));
        const startDay = day.startOf("isoWeek");
        const endDay = day.endOf("isoWeek");
        const newKey = `${parseWeekDate(startDay)} - ${parseWeekDate(endDay)}${
          endDay.year() !== dayjs().year() ? `, ${endDay.year()}` : ""
        }`;
        return [newKey, val];
      });
  }, [data]);

  return (
    <Layout>
      <Toaster position="top-center" />
      <Account.Header />
      <Account.Menu defaultSelected="/history" />
      {loading ? (
        <h2>Loading...</h2>
      ) : error || (!data?.userHistory && !doNotAllow) ? (
        <h2>Error</h2>
      ) : (
        <Next.Motion.Container>
          {!doNotAllow ? (
            <div className="flex-column-flex-start-flex-start">
              {sortedData.map((val, i) => (
                <div className="w-100 account-history__section" key={i}>
                  <h5 className="header-6 semibold">{val[0]}</h5>
                  <div>
                    {val[1].map(({ userHistory: { id }, ...rest }) => (
                      <Account.HistoryAction key={id} {...rest} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Next.DoNotHave emoji="⚙️">
              Please go to your{" "}
              <Next.Link href={{ pathname: "/account", hash: "preferences" }}>account preferences</Next.Link> and enable
              the "Track search history" feature, to keep a record of your search history.
            </Next.DoNotHave>
          )}
        </Next.Motion.Container>
      )}
    </Layout>
  );
};

export default History;

export const getServerSideProps: GetServerSideProps = async ctx => {
  const apolloClient = initializeApollo(ctx);

  const {
    data: { me },
  } = await getAuth({ apolloClient });
  if (me && me.account.trackHistory) await apolloClient.query({ query: UserHistoryDocument });

  return { props: { [INITIAL_APOLLO_STATE]: apolloClient.cache.extract() } };
};
