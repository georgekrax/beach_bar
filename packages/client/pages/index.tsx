import { BeachBarFavouriteCanvasProps } from "@/components/BeachBar";
import Carousel from "@/components/Carousel";
import Layout from "@/components/Layout";
import Next from "@/components/Next";
import Search from "@/components/Search";
import { useGetPersonalizedBeachBarsQuery, useNearBeachBarsQuery, useUserSearchesQuery } from "@/graphql/generated";
import { userIpAddr } from "@/lib/apollo/cache";
import { useAuth, useIsDevice } from "@/utils/hooks";
import { useReactiveVar } from "@apollo/client";
import { Box, Button, Flex, SimpleGrid } from "@hashtag-design-system/components";
import { signIn, signOut, useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";

// const SearchBoxDynamic = dynamic<any>(() => import("@/components/Search/Box").then(mod => mod.Box));
const BeachBarFavouriteCanvasDynamic = dynamic<BeachBarFavouriteCanvasProps>(() =>
  import("@/components/BeachBar/Favourite/Canvas").then(mod => mod.Canvas)
);
const SearchRecentDynamic = dynamic<React.ComponentProps<typeof Search["Recent"]>>(() =>
  import("@/components/Search/Recent").then(mod => mod.Recent)
);

// const IndexPage: InferGetServerSidePropsType<typeof getServerSideProps> = ({ referer }) => {
const IndexPage = () => {
  const router = useRouter();
  // const mainRef = useRef<HTMLDivElement>(null);

  const { isDesktop } = useIsDevice();
  const ipAddress = useReactiveVar(userIpAddr);
  const { data: session } = useSession();
  // const { inputValue, results, dispatch } = useSearchContext();
  // const { data: allBeachBarsData } = useGetAllBeachBarsQuery();

  // const { height } = useWindowDimensions();
  // const isSmallHeight = height <= 600;

  const { data: authData, refetch: authRefetch } = useAuth();
  const { data, error, loading } = useGetPersonalizedBeachBarsQuery();
  const {
    data: recentData,
    loading: recentLoading,
    error: recentError,
    refetch: recentRefetch,
  } = useUserSearchesQuery({ variables: { limit: 6 } });
  const { data: nearData, error: nearError } = useNearBeachBarsQuery({
    skip: !ipAddress?.lat || !ipAddress.lon,
    variables: { latitude: (ipAddress?.lat || 0).toString(), longitude: (ipAddress?.lon || 0).toString() },
  });

  useEffect(() => {
    // if (referer && !referer.includes("search") && inputValue && results.arr.length > 0) {
    //   router.push({ pathname: "/search" });
    // }
    router.prefetch(isDesktop ? "/search" : "/search?box=1");
  }, []);

  useEffect(() => {
    // if (!session?.id) {
    if (!authData?.me?.id) {
      authRefetch();
      recentRefetch();
    }
    // }, [session?.expires, session?.id]);
  }, [session?.expires, authData?.me?.id]);

  return (
    <Layout>
      <Box
        position="relative"
        // position="absolute"
        // top={0}
        // left={0}
        // width="40%"
        mt={-12}
        width="100%"
        height="50vh"
        flexShrink={0}
        overflow="hidden"
        zIndex="hide"
        userSelect="none"
        borderBottomRadius={24}
      >
        {/* <div className="home__img__container" style={{ width: width - 651 }}> */}
        <Image
          src="https://images.unsplash.com/photo-1533930885163-9a19e215b300?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&q=100"
          alt="Homepage beach image"
          priority
          objectFit="cover"
          objectPosition="center -24px"
          layout="fill"
          loading="eager"
          quality={100}
        />
        {/* </div> */}
      </Box>
      <Search.Box maxWidth="80%" mt="-40px" mx="auto" />
      <Button
        onClick={() => {
          signIn("credentials", { redirect: false, email: "georgekraxt@gmail.com", password: "george2016" });
        }}
      >
        Sign in with Credentials
      </Button>
      <Button onClick={() => signOut({ redirect: false })}>Logout</Button>
      <Next.Link link={{ href: { pathname: "/beach/[...slug]", query: { slug: ["kikabu"] } } }}>Link</Next.Link>
      <Box my={8}>
        <h4>Near You</h4>
        {error || nearError ? (
          <h2>Error</h2>
        ) : (
          <SimpleGrid
            position="relative"
            mt={3}
            columns={3}
            autoFlow="row"
            columnGap={10}
            rowGap={6}
            scrollSnapType="x mandatory"
            overflowX="auto"
            cursor="grab"
            className="home__near-you__grid-container no-scrollbar"
          >
            {(nearData?.nearBeachBars.concat(nearData?.nearBeachBars) || new Array(6).fill(undefined)).map((bar, i) => (
              <Search.NearYou key={"near_you_" + i} loading={loading || !bar} {...bar} />
            ))}
          </SimpleGrid>
        )}
      </Box>
      <Carousel.Context>
        <Flex justify="space-between" align="center">
          <h4>Discover</h4>
          <div>
            <Carousel.ControlBtn dir="prev" />
            <Carousel.ControlBtn dir="next" />
          </div>
        </Flex>
        <Carousel my={12}>
          {data?.getPersonalizedBeachBars.map(({ id, ...rest }, i) => (
            <Carousel.Item key={"carousel_item_" + id} idx={i} className="h10">
              <Carousel.BeachBar {...rest} className="ih00" />
            </Carousel.Item>
          ))}
        </Carousel>
      </Carousel.Context>
      {authData?.me && (
        <Flex
          flexDirection={{ base: "column", md: "row" }}
          gap={12}
          mt={10}
          mb={16}
          sx={{ "& > section": { flexBasis: "50%" } }}
        >
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
        </Flex>
      )}
    </Layout>
  );

  // return (
  //   <Layout header={{ className: "home__header" }}>
  //     {/* <motion.div className="home__container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit="initial"> */}
  //     {/* <div className="w100 flex-row-flex-start-flex-start">
  //       <div className="home__img">
  //         <div className="home__img__container" style={{ width: width - 651 }}>
  //         </div>
  //       </div>
  //       <div
  //         ref={mainRef}
  //         className="home__main w100 flex-column-flex-start-flex-start"
  //         style={isSmallHeight ? { height: "auto" } : undefined}
  //       >
  //         <Search.Box />
  //         <div className="home__near-you">
  //           <h4>Near You</h4>
  //           {error || nearError ? (
  //             <h2>Error</h2>
  //           ) : (
  //             <div
  //               className="home__near-you__grid-container no-scrollbar"
  //               // vertical={false}
  //               // activationDistance={3}
  //             >
  //               {(nearData?.nearBeachBars || new Array(4).fill(undefined)).map((bar, i) => (
  //                 <Search.NearYou key={"near_you_" + i} loading={loading || !bar} {...bar} />
  //               ))}
  //             </div>
  //           )}
  //         </div>
  //         <button onClick={() => dispatch({ type: SEARCH_ACTIONS.TOGGLE_MAP_DIALOG, payload: { bool: true } })}>
  //           Show Map
  //         </button>
  //       </div>
  //     </div>
  //     {/* </motion.div> */}
  //   </Layout>
  // );
};

export default IndexPage;

// export const getServerSideProps: GetServerSideProps = async ctx => {
//   const apolloClient = initializeApollo(ctx);

//   await apolloClient.query({ query: UserSearchesDocument });
//   await apolloClient.query({ query: GetPersonalizedBeachBarsDocument });

//   return {
//     props: {
//       referer: ctx.req.headers.referer || null,
//       [INITIAL_APOLLO_STATE]: apolloClient.cache.extract(),
//     },
//   };
// };
