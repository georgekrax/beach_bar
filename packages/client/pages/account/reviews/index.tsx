import { motion } from "framer-motion";
import { GetServerSideProps } from "next";
import { useMemo } from "react";
import { Toaster } from "react-hot-toast";
import Account from "../../../components/Account";
import BeachBar from "../../../components/BeachBar";
import Layout from "../../../components/Layout";
import Next from "../../../components/Next";
import { UserReviewsDocument, useUserReviewsQuery } from "../../../graphql/generated";
import { initializeApollo, INITIAL_APOLLO_STATE } from "../../../lib/apollo";
import { getAuth } from "../../../lib/auth";

const Reviews: React.FC = () => {
  const { data, loading, error } = useUserReviewsQuery();

  return (
    <Layout>
      <Toaster position="top-center" />
      <Account.Header />
      <Account.Menu defaultSelected="/reviews" />
      {loading ? (
        <h2>Loading...</h2>
      ) : error || !data ? (
        <h2>Error</h2>
      ) : (
        <motion.div
          className="account-reviews__container flex-row-flex-start-flex-start"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit="initial"
        >
          {data.userReviews.length > 0 ? (
            <>
              {data.userReviews.map(({ id, ...props }) => (
                <BeachBar.Review key={id} id={id} {...props} />
              ))}
            </>
          ) : (
            <Next.DoNotHave msg="You have not written a review for a #beach_bar" emoji="⭐" />
          )}
        </motion.div>
      )}
    </Layout>
  );
};

Reviews.displayName = "AccountReviews";

export default Reviews;

export const getServerSideProps: GetServerSideProps = async ctx => {
  const apolloClient = initializeApollo(ctx);

  await getAuth({ apolloClient });
  await apolloClient.query({ query: UserReviewsDocument });

  return {
    props: {
      [INITIAL_APOLLO_STATE]: apolloClient.cache.extract(),
    },
  };
};
