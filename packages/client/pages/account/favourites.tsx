import { motion, Variants } from "framer-motion";
import { GetServerSideProps } from "next";
import { Toaster } from "react-hot-toast";
import Account from "../../components/Account";
import BeachBar from "../../components/BeachBar";
import Layout from "../../components/Layout";
import Next from "../../components/Next";
import { FavouriteBeachBarsDocument, useFavouriteBeachBarsQuery } from "../../graphql/generated";
import { initializeApollo, INITIAL_APOLLO_STATE } from "../../lib/apollo";

const containerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const Favourites: React.FC = () => {
  const {
    data: { favouriteBeachBars },
    loading,
    error,
  } = useFavouriteBeachBarsQuery();

  return (
    <Layout>
      <Toaster position="top-center" />
      <Account.Header />
      <Account.Menu defaultSelected="/favourites" />
      {loading ? (
        <h2>Loading...</h2>
      ) : error || !favouriteBeachBars ? (
        <h2>Error</h2>
      ) : (
        <Next.Motion.Container>
          {favouriteBeachBars.length > 0 ? (
            <motion.div
              className="account-favourites__container w-100 flex-row-flex-start-flex-start"
              animate="animate"
              initial="initial"
              variants={containerVariants}
            >
              {favouriteBeachBars.map(({ beachBar: { id, ...rest } }) => (
                <BeachBar.Favourite key={id} id={id} {...rest} />
              ))}
            </motion.div>
          ) : (
            <Next.DoNotHave msg="You have not added any #beach_bar into your favourites list" emoji="❤️" />
          )}
        </Next.Motion.Container>
      )}
    </Layout>
  );
};

Favourites.displayName = "AccountFavourites";

export default Favourites;

export const getServerSideProps: GetServerSideProps = async ctx => {
  const apolloClient = initializeApollo(ctx);

  await apolloClient.query({ query: FavouriteBeachBarsDocument });

  return { props: { [INITIAL_APOLLO_STATE]: apolloClient.cache.extract() } };
};
