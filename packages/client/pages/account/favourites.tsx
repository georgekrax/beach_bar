import Account from "@/components/Account";
import BeachBar from "@/components/BeachBar";
import Layout from "@/components/Layout";
import Next from "@/components/Next";
import { useFavouriteBeachBarsQuery } from "@/graphql/generated";
import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.2 } },
};

const Favourites: React.FC = () => {
  const { data, loading, error } = useFavouriteBeachBarsQuery({
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  return (
    <Layout hasToaster>
      <Account.Dashboard defaultSelected="/account/favourites">
        {loading ? (
          <h2>Loading...</h2>
        ) : error || !data?.favouriteBeachBars ? (
          <h2>Error</h2>
        ) : (
          <Next.MotionContainer>
            {data.favouriteBeachBars.length > 0 ? (
              <motion.div
                className="account__favourites w100 flex-row-flex-start-flex-start"
                animate="animate"
                initial="initial"
                variants={containerVariants}
              >
                {data.favouriteBeachBars.map(({ beachBar: { id, ...rest } }) => (
                  <BeachBar.Favourite key={"beach_bar_" + id} id={id} {...rest} />
                ))}
              </motion.div>
            ) : (
              <Next.DoNotHave msg="You do not have any favourite #beach_bars." emoji="❤️" />
            )}
          </Next.MotionContainer>
        )}
      </Account.Dashboard>
    </Layout>
  );
};

Favourites.displayName = "AccountFavourites";

export default Favourites;

// export const getStaticProps: GetStaticProps = async () => {
//   const apolloClient = initializeApollo();

//   await apolloClient.query({ query: FavouriteBeachBarsDocument });

//   return { props: { [INITIAL_APOLLO_STATE]: apolloClient.cache.extract() }, revalidate: 1 };
// };
