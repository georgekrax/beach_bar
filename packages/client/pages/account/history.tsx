import Account from "@/components/Account";
import Layout from "@/components/Layout";
import Next from "@/components/Next";
import { useMeLazyQuery, UserHistoryQuery, useUserHistoryQuery } from "@/graphql/generated";
import { DAY_NAMES_ARR, MONTHS } from "@the_hashtag/common";
import dayjs, { Dayjs } from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { groupBy } from "lodash";
import { useEffect, useMemo } from "react";

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

const AccountHistoryPage: React.FC = () => {
  const [getMe, { data: authData }] = useMeLazyQuery();
  const doNotAllow = useMemo(() => !authData?.me?.account?.trackHistory, [authData]);
  const { data, loading, error } = useUserHistoryQuery({ skip: doNotAllow });

  const parseWeekDate = (day: Dayjs) => {
    return `${DAY_NAMES_ARR.find(({ id }) => id === day.day())?.name.substring(0, 3)} ${day.date()} ${MONTHS[
      day.month()
    ]?.substring(0, 3)}`;
  };

  const sortedData: [string, UserHistoryQuery["userHistory"]][] = useMemo(() => {
    if (!data?.userHistory || data.userHistory.length === 0) return [];
    const weeksObj = groupBy(data.userHistory, dt => dayjs(dt.userHistory.timestamp).week());
    return Object.entries(weeksObj)
      .filter(([_, val]) => val.some(({ beachBar, search }) => beachBar || search))
      .map(([key, val]) => {
        const day = dayjs().week(parseInt(key));
        const endDay = day.endOf("isoWeek");
        const newKey = `${parseWeekDate(day.startOf("isoWeek")) + " - " + parseWeekDate(endDay)}${
          endDay.year() !== dayjs().year() ? `, ${endDay.year()}` : ""
        }`;
        return [newKey, val];
      });
  }, [data]);

  useEffect(() => {
    setTimeout(() => getMe(), 500);
  }, []);

  return (
    <Layout hasToaster>
      <Account.Dashboard defaultSelected="/account/history">
        {loading ? (
          <h2>Loading...</h2>
        ) : error || (!data?.userHistory && !doNotAllow) ? (
          <h2>Error</h2>
        ) : (
          <Next.MotionContainer>
            {!doNotAllow ? (
              <div className="flex-column-flex-start-flex-start">
                {sortedData.map((val, i) => (
                  <div className="w100 account__history" key={i}>
                    <h5 className="header-6 semibold">{val[0]}</h5>
                    <div>
                      {val[1].map(({ userHistory: { id }, ...rest }) => (
                        <Account.HistoryItem key={"history_item_" + id} {...rest} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Next.DoNotHave emoji="⚙️" style={{ maxWidth: "35rem", marginLeft: "auto", marginRight: "auto" }}>
                Please go to your&nbsp;
                <Next.Link link={{ href: { pathname: "/account", hash: "preferences" } }}>
                account preferences
                </Next.Link>&nbsp;
                and enable the "Track search history" feature, to keep a record of your search history.
              </Next.DoNotHave>
            )}
          </Next.MotionContainer>
        )}
      </Account.Dashboard>
    </Layout>
  );
};

AccountHistoryPage.displayName = "AccountHistoryPage";

export default AccountHistoryPage;
