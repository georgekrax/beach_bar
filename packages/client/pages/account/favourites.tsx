import Account from "@/components/Account";
import BeachBar from "@/components/BeachBar";
import Layout from "@/components/Layout";
import { NextMotionContainer } from "@/components/Next/MotionContainer";
import { NextDoNotHave } from "@/components/Next/DoNotHave";
import { FavouriteBeachBarsDocument, useFavouriteBeachBarsQuery } from "@/graphql/generated";
import { initializeApollo, INITIAL_APOLLO_STATE } from "@/lib/apollo";
import { motion, Variants } from "framer-motion";
import { GetServerSideProps } from "next";
import { Toaster } from "react-hot-toast";

const containerVariants: Variants = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.2 },
  },
};

const Favourites: React.FC = () => {
  const { data, loading, error } = useFavouriteBeachBarsQuery();

  return (
    <Layout>
      <Toaster position="top-center" />
      <Account.Header />
      <Account.Menu defaultSelected="/favourites" />
      {loading ? (
        <h2>Loading...</h2>
      ) : error || !data?.favouriteBeachBars ? (
        <h2>Error</h2>
      ) : (
        <NextMotionContainer>
          {data.favouriteBeachBars.length > 0 ? (
            <motion.div
              className="account-favourites__container w100 flex-row-flex-start-flex-start"
              animate="animate"
              initial="initial"
              variants={containerVariants}
            >
              {data.favouriteBeachBars.map(({ beachBar: { id, ...rest } }) => (
                <BeachBar.Favourite key={id} id={id} {...rest} />
              ))}
            </motion.div>
          ) : (
            <NextDoNotHave msg="You have not added any #beach_bar into your favourites list" emoji="❤️" />
          )}
        </NextMotionContainer>
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
