import BeachBar from "@/components/BeachBar";
import { FavouriteHeartBox } from "@/components/BeachBar/Favourite/HeartBox";
import { BeachBarHeading } from "@/components/BeachBar/Heading";
import Layout from "@/components/Layout";
import { LayoutIconHeader } from "@/components/Layout/IconHeader";
import Next from "@/components/Next";
import { IconBox } from "@/components/Next/IconBox";
import { SEARCH_ACTIONS } from "@/components/Search";
import { BeachBarDocument, BeachBarQuery, BeachBarQueryVariables, useBeachBarQuery } from "@/graphql/generated";
import { initializeApollo, INITIAL_APOLLO_STATE } from "@/lib/apollo";
import { BeachQueryParams } from "@/typings/beachBar";
import { useSearchContext } from "@/utils/contexts";
import { extractBeachQuery, getBeachBarStaticPaths } from "@/utils/data";
import { useConfig } from "@/utils/hooks";
import { shareWithSocials } from "@/utils/notify";
import { COMMON_CONFIG } from "@beach_bar/common";
import { useWindowDimensions } from "@hashtag-design-system/components";
import Icon from "@hashtag-design-system/icons";
import { AnimatePresence, motion } from "framer-motion";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { memo, useEffect, useMemo } from "react";
import { Toaster } from "react-hot-toast";

const { REVIEW_SCORES } = COMMON_CONFIG.DATA.searchFilters;

const HEADING_PSEUDO_STYLE = {
  content: '""',
  position: "absolute",
  top: 0,
  width: "containerPad",
  height: "100%",
  bg: "white",
  right: "100%",
};

const BeachPage: React.FC = memo(() => {
  const { query, asPath, isFallback, ...router } = useRouter();
  const { width } = useWindowDimensions();

  const {
    variables: { breakpoints },
  } = useConfig();
  const { _query, dispatch } = useSearchContext();

  const queryParams: BeachQueryParams = useMemo(() => {
    const { secondParam, ...rest } = extractBeachQuery(query);
    return {
      ...rest,
      secondParam,
      isProducts: secondParam ? secondParam === "products" : false,
      isReviews: secondParam ? secondParam === "reviews" : false,
      isPhotos: secondParam ? secondParam === "photos" : false,
    };
  }, [query?.slug?.length, query?.slug?.[0], query?.slug?.[1], _query.date?.format(), _query.time?.start, _query.time?.end]);
  const { slug, secondParam, isProducts, isReviews, isPhotos } = queryParams;

  const { data, loading, error } = useBeachBarQuery({
    variables: { slug, userVisit: true },
    // notifyOnNetworkStatusChange: !isCartShown,
  });

  const reviewScore = useMemo(
    () => Object.values(REVIEW_SCORES).find(({ rating }) => (data?.beachBar?.avgRating || 0) >= rating),
    [data?.beachBar?.avgRating]
  );

  const handleRouterBack = () => {
    let newUrl: string | undefined;
    if (query.redirect) newUrl = query.redirect.toString();
    else if (secondParam) newUrl = asPath.replace("/" + secondParam, "");
    newUrl ? router.replace(newUrl, undefined, { shallow: true }) : router.back();
  };

  useEffect(() => {
    const isMobileScreen = window.matchMedia(`screen and (max-width: ${breakpoints.md - 5}px)`).matches;
    if (slug) {
      if ((secondParam && !isProducts && !isReviews && !isPhotos) || (isProducts && !isMobileScreen)) {
        router.replace({ pathname: asPath, query: {} });
      }
    }
  }, [query]);

  return (
    <Layout shoppingCart tapbar={false} header={{ isSticky: false }}>
      <Toaster position={isReviews ? "top-right" : "top-center"} />
      {isFallback || loading ? (
        <h2>Loading...</h2>
      ) : error || !data?.beachBar ? (
        <h2>Error</h2>
      ) : (
        <Next.MotionContainer>
          <LayoutIconHeader
            position="sticky"
            top={0}
            left={0}
            pt={4}
            pb={4}
            bg="white"
            zIndex="md"
            _before={{ ...HEADING_PSEUDO_STYLE, right: "100%" }}
            _after={{ ...HEADING_PSEUDO_STYLE, left: "100%" }}
            before={{
              align: "flex-start",
              children: (
                <>
                  {/* <Link
                  href={query.redirect ? (query.redirect as string) : secondParam ? asPath.replace("/" + secondParam, "") : { pathname: "/search" }}
                  shallow
                  replace
                  passHref
                >
                  <a> */}
                  <IconBox aria-label="Return" onClick={handleRouterBack}>
                    <Icon.Arrow.Left />
                  </IconBox>
                  {/* </a> */}
                  {/* // </Link> */}
                  <BeachBarHeading
                    display={isProducts ? "block" : { base: "none", sm: "block" }}
                    m={isProducts ? "auto 0" : { sm: 0 }}
                    ml={{ sm: 1 }}
                    name={data.beachBar.name}
                    city={!isProducts ? data.beachBar.location.city.name : undefined}
                  />
                </>
              ),
            }}
            after={{
              children: (
                <>
                  {!isProducts && <FavouriteHeartBox boxSize="icon.md" beachBarSlug={data.beachBar.slug} />}
                  <IconBox
                    aria-label="View your shopping cart"
                    onClick={() => dispatch({ type: SEARCH_ACTIONS.TOGGLE_CART, payload: { bool: true } })}
                  >
                    <Icon.Payment.ShoppingCart />
                  </IconBox>
                  <IconBox
                    aria-label="Share this #beach_bar with other people"
                    onClick={() => shareWithSocials(data.beachBar?.name)}
                    // photos ? onClick={() => shareWithSocials("#beach_bar", "with")}
                  >
                    <Icon.People.Share />
                  </IconBox>
                </>
              ),
            }}
          />
          {/* {isProducts && <h5 className="beach_bar__header__name">{data.beachBar.name}</h5>}
            </LayoutIconHeader> */}
          <AnimatePresence exitBeforeEnter>
            {isProducts ? (
              <motion.div key={secondParam} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <BeachBar.Product.MainPage
                  barCurrencySymbol={data.beachBar.currency.symbol}
                  products={data.beachBar.products}
                />
              </motion.div>
            ) : (
              <>
                <BeachBar
                  key="main_content"
                  {...data.beachBar}
                  isPhotos={isPhotos}
                  queryParams={queryParams}
                  reviewScore={reviewScore}
                >
                  <BeachBar.Review.MainPage
                    isOpen={isReviews}
                    beachBar={{ ...data.beachBar }}
                    reviewScore={reviewScore}
                  />
                  <AnimatePresence exitBeforeEnter>
                    {isPhotos && <BeachBar.Page.Photos key="photos" imgsArr={data.beachBar.imgUrls} />}
                    {/* // <Modal.Overlay isShown>
                      //   <motion.div
                      //     className="beach_bar__reviews h100"
                      //     initial={{ x: "100%", borderRadius: "96px 0px 0px 96px" }}
                      //     animate={{
                      //       x: 0,
                      //       borderRadius: width <= 540 ? "0px 0px 0px 0px" : "32px 0px 0px 32px",
                      //       transition: { stiffness: 100 },
                      //     }}
                      //     exit={{ x: "100%" }}
                      //     style={{ maxWidth: "32em" }}
                      //   >
                      //     <BeachBar.Review.MainPage beachBar={{ ...data.beachBar }} reviewScore={reviewScore} />
                      //   </motion.div>
                      // </Modal.Overlay> */}
                  </AnimatePresence>
                </BeachBar>
              </>
            )}
          </AnimatePresence>
        </Next.MotionContainer>
      )}
    </Layout>
  );
});

export default BeachPage;

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await getBeachBarStaticPaths();
  return res;
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const apolloClient = initializeApollo();

  if (params) {
    const { slug, availability } = extractBeachQuery(params);
    await apolloClient.query<BeachBarQuery>({
      query: BeachBarDocument,
      variables: { slug, userVisit: true, availability } as BeachBarQueryVariables,
    });
  } else return { redirect: { destination: "/", permanent: true } };

  return { props: { [INITIAL_APOLLO_STATE]: apolloClient.cache.extract() }, revalidate: 5 };
};
