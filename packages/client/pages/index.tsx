import { BeachBarFavouriteCanvasProps } from "@/components/BeachBar/Favourite/Canvas";
import Carousel from "@/components/Carousel";
import Layout from "@/components/Layout";
import Search, { SEARCH_ACTIONS } from "@/components/Search";
import {
  GetPersonalizedBeachBarsDocument,
  useGetPersonalizedBeachBarsQuery,
  useNearBeachBarsQuery,
  UserSearchesDocument,
  useUserSearchesQuery,
} from "@/graphql/generated";
import { initializeApollo, INITIAL_APOLLO_STATE } from "@/lib/apollo";
import { userIpAddr } from "@/lib/apollo/cache";
import { useSearchContext } from "@/utils/contexts";
import { useAuth, useIsDesktop } from "@/utils/hooks";
import { useReactiveVar } from "@apollo/client";
import { useWindowDimensions } from "@hashtag-design-system/components";
import { motion } from "framer-motion";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

// const SearchBoxDynamic = dynamic<any>(() => import("@/components/Search/Box").then(mod => mod.Box));
const BeachBarFavouriteCanvasDynamic = dynamic<BeachBarFavouriteCanvasProps>(() =>
  import("@/components/BeachBar/Favourite/Canvas").then(mod => mod.Canvas)
);
const SearchRecentDynamic = dynamic<React.ComponentProps<typeof Search["Recent"]>>(() =>
  import("@/components/Search/Recent").then(mod => mod.Recent)
);

const IndexPage: InferGetServerSidePropsType<typeof getServerSideProps> = ({ referer }) => {
  const router = useRouter();
  const mainRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();
  const { lat, lon } = useReactiveVar(userIpAddr);

  const { width } = useWindowDimensions();
  const { inputValue, results, dispatch } = useSearchContext();

  const { data: authData } = useAuth();
  const { data, error, loading } = useGetPersonalizedBeachBarsQuery();
  const { data: recentData, loading: recentLoading, error: recentError } = useUserSearchesQuery({
    variables: { limit: 8 },
  });
  const { data: nearData, error: nearError } = useNearBeachBarsQuery({
    skip: !lat || !lon,
    variables: { latitude: lat.toString(), longitude: lon.toString() },
  });

  useEffect(() => {
    if (referer && !referer.includes("search") && inputValue && results.arr.length > 0)
      router.push({ pathname: "/search" });
    router.prefetch(isDesktop ? "/search" : "/search?box=true");
  }, []);

  return (
    <Layout header={{ className: "home__header" }}>
      <motion.div className="home__container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit="initial">
        <div className="w100 flex-row-flex-start-flex-start">
          <div className="home__img">
            <div className="home__img__container">
              <Image
                src="https://images.unsplash.com/photo-1533930885163-9a19e215b300?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=998&q=100"
                alt="Homepage beach image"
                priority
                objectFit="cover"
                objectPosition="center bottom"
                layout="fill"
                quality={100}
                loading="eager"
              />
            </div>
          </div>
          <div ref={mainRef} className="home__main">
            <Search.Box />
            {loading ? (
              <h2>Loading...</h2>
            ) : error ? (
              <h2>Error</h2>
            ) : (
              <>
                <div className="home__near-you">
                  <button
                    onClick={() => {
                      dispatch({ type: SEARCH_ACTIONS.TOGGLE_MAP_DIALOG, payload: { bool: true } });
                    }}
                  >
                    Show Map
                  </button>
                  <h4>Near You</h4>
                  {nearError ? (
                    <h2>Error</h2>
                  ) : (
                    <div style={{ minHeight: (nearData?.nearBeachBars.length || 0) > 3 ? "10.5em" : "4.75em" }}>
                      <div
                        className="home__near-you__grid-container no-scrollbar"
                        style={{ maxWidth: width - (mainRef.current?.offsetLeft || 0) + "px" }}
                      >
                        {nearData?.nearBeachBars.map(({ id, location, ...rest }) => (
                          <Search.NearYou key={"near_you_" + id} {...location} {...rest} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <Carousel.Context>
                  <div className="flex-row-space-between-center">
                    <h4>Discover</h4>
                    <Carousel.ControlBtns />
                  </div>
                  <Carousel>
                    {data?.getPersonalizedBeachBars.map(({ id, location, ...rest }, i) => (
                      <Carousel.Item key={"carousel_item_" + id} idx={i}>
                        <Carousel.BeachBar {...location} {...rest} />
                      </Carousel.Item>
                    ))}
                  </Carousel>
                </Carousel.Context>
              </>
            )}
          </div>
        </div>
        {authData && authData.me && (
          <div className="home__user-custom flex-column-flex-start-flex-start">
            {recentLoading ? (
              <h2>Loading...</h2>
            ) : recentError ? (
              <h2>Error</h2>
            ) : (
              <>
                <BeachBarFavouriteCanvasDynamic arr={authData.me.favoriteBars || []} />
                <SearchRecentDynamic searches={recentData?.userSearches || []} />
              </>
            )}
          </div>
        )}
      </motion.div>
    </Layout>
  );
};

export default IndexPage;

export const getServerSideProps: GetServerSideProps = async ctx => {
  const apolloClient = initializeApollo(ctx);

  await apolloClient.query({ query: UserSearchesDocument });
  await apolloClient.query({ query: GetPersonalizedBeachBarsDocument });

  return {
    props: {
      referer: ctx.req.headers.referer || null,
      [INITIAL_APOLLO_STATE]: apolloClient.cache.extract(),
    },
  };
};
