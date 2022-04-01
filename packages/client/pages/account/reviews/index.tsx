import Account from "@/components/Account";
import BeachBar from "@/components/BeachBar";
import Layout from "@/components/Layout";
import Next from "@/components/Next";
import { useReviewsQuery } from "@/graphql/generated";
import { useMemo } from "react";

const AccountReviewsPage: React.FC = () => {
  const { data, loading, error } = useReviewsQuery({ nextFetchPolicy: "cache-first" });

  const sortedArr = useMemo(
    () =>
      Array.from(data?.reviews || []).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [data]
  );

  return (
    <Layout hasToaster>
      <Account.Dashboard defaultSelected="/account/reviews">
        {loading ? (
          <h2>Loading...</h2>
        ) : error || !data?.reviews ? (
          <h2>Error</h2>
        ) : (
          <Next.MotionContainer className="account__reviews flex--wrap flex-row-flex-start-flex-start">
            {sortedArr.length > 0 ? (
              <>
                {sortedArr.map(({ id, ...props }) => (
                  <BeachBar.Review key={"review_" + id} id={id} {...props} />
                ))}
              </>
            ) : (
              <Next.DoNotHave emoji="⭐" msg="You have not written a review for a #beach_bar." />
            )}
          </Next.MotionContainer>
        )}
      </Account.Dashboard>
    </Layout>
  );
};

AccountReviewsPage.displayName = "AccountReviewsPage";

export default AccountReviewsPage;
