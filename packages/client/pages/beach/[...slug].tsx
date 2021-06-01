import BeachBar from "@/components/BeachBar";
import { FavouriteHeartBox } from "@/components/BeachBar/Favourite/HeartBox";
import { BeachBarHeading } from "@/components/BeachBar/Heading";
import Icons from "@/components/Icons";
import Layout from "@/components/Layout";
import { LayoutIconHeader } from "@/components/Layout/IconHeader";
import { IconBox } from "@/components/Next/IconBox";
import { NextMotionContainer } from "@/components/Next/MotionContainer";
import { SEARCH_ACTIONS } from "@/components/Search";
import {
  AvailableProductsDocument,
  AvailableProductsQuery,
  AvailableProductsQueryVariables,
  BeachBarDocument,
  BeachBarQuery,
  useBeachBarQuery,
} from "@/graphql/generated";
import { initializeApollo, INITIAL_APOLLO_STATE } from "@/lib/apollo";
import { AvailableProductsArr } from "@/typings/beachBar";
import { useSearchContext } from "@/utils/contexts";
import { getBeachBarStaticPaths } from "@/utils/data";
import { useConfig } from "@/utils/hooks";
import { shareWithSocials } from "@/utils/notify";
import { useApolloClient } from "@apollo/client";
import { COMMON_CONFIG } from "@beach_bar/common";
import { Modal, useWindowDimensions } from "@hashtag-design-system/components";
import { AnimatePresence, motion } from "framer-motion";
import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo, useEffect, useMemo, useState } from "react";
import { Toaster } from "react-hot-toast";

const { REVIEW_SCORES } = COMMON_CONFIG.DATA.searchFilters;

const BeachPage: React.FC = memo(() => {
  const [availableProducts, setAvailableProducts] = useState<AvailableProductsArr>([]);
  const { width } = useWindowDimensions();
  const { query, asPath, ...router } = useRouter();
  const slug = useMemo(() => query.slug?.[0] || "", [query]);
  const secondQueryParam = useMemo(() => query.slug?.[1], [query]);
  const isProducts = useMemo(() => (secondQueryParam ? secondQueryParam === "products" : false), [query]);
  const isReviews = useMemo(() => (secondQueryParam ? secondQueryParam === "reviews" : false), [query]);
  const isPhotos = useMemo(() => (secondQueryParam ? secondQueryParam === "photos" : false), [query]);

  const {
    variables: { breakpoints },
  } = useConfig();
  const { inputValue, results, date, hourTime, people, dispatch } = useSearchContext();

  console.log(query);
  const { data, loading, error } = useBeachBarQuery({
    variables: { slug, userVisit: true },
    // notifyOnNetworkStatusChange: !isCartShown,
  });
  const apolloClient = useApolloClient();
  const reviewScore = useMemo(
    () => Object.values(REVIEW_SCORES).find(({ rating }) => (data?.beachBar?.avgRating || 0) >= rating),
    [data]
  );

  const fetchAvailableProducts = async () => {
    const { data: res, errors } = await apolloClient.query<AvailableProductsQuery>({
      query: AvailableProductsDocument,
      variables: {
        beachBarId: data?.beachBar!.id,
        availability: { date, timeId: hourTime?.toString(), adults: people?.adults || 1, children: people?.children },
      } as AvailableProductsQueryVariables,
    });
    if (res && res.availableProducts && (errors?.length ?? 0) === 0)
      setAvailableProducts(res.availableProducts.map(({ product }) => product));
  };

  useEffect(() => {
    const isMobileScreen = window.matchMedia(`screen and (max-width: ${breakpoints.md - 5}px)`).matches;
    const queryParams = query.slug;
    if (queryParams) {
      if ((queryParams.length >= 2 && !isProducts && !isReviews && !isPhotos) || (isProducts && !isMobileScreen))
        router.replace(`/beach/${asPath.split("/")[2]}`);
    }
  }, [query]);

  useEffect(() => {
    if (data?.beachBar) {
      if (date && inputValue && results.arr.length > 0) fetchAvailableProducts();
      else if (availableProducts.length === 0)
        setAvailableProducts(data.beachBar.products.map(({ __typename, ...rest }) => rest));
    }
  }, [data]);

  return (
    <Layout tapbar={false} header={{ sticky: false }} shoppingCart>
      <Toaster position={isReviews ? "top-right" : "top-center"} />
      {router.isFallback || loading ? (
        <h2>Loading...</h2>
      ) : error || !data || !data.beachBar ? (
        <h2>Error</h2>
      ) : (
        <NextMotionContainer>
          <LayoutIconHeader
            className="beach_bar__heading zi--md"
            before={
              <>
                <Link
                  href={
                    query.redirect
                      ? (query.redirect as string)
                      : secondQueryParam
                      ? { pathname: `/beach/${query.slug?.[0]}` }
                      : {
                          pathname: "/search",
                          query: !inputValue || results.arr.length === 0 ? { box: true } : undefined,
                        }
                  }
                  shallow
                  passHref
                >
                  <a>
                    <IconBox aria-label="Return">
                      <Icons.Arrow.Left />
                    </IconBox>
                  </a>
                </Link>
                <BeachBarHeading
                  className={isProducts ? "id--block im-tb--auto" : undefined}
                  name={data.beachBar.name}
                  city={!isProducts ? data.beachBar.location.city.name : undefined}
                />
              </>
            }
            after={
              <>
                {!isProducts && <FavouriteHeartBox beachBarSlug={data.beachBar.slug} />}
                <IconBox
                  aria-label="View your shopping cart"
                  onClick={() => dispatch({ type: SEARCH_ACTIONS.TOGGLE_CART, payload: { bool: true } })}
                >
                  <Icons.ShoppingCart />
                </IconBox>
                <IconBox
                  aria-label="Share this #beach_bar with other people"
                  onClick={() => shareWithSocials(data.beachBar?.name)}
                  // photos ? onClick={() => shareWithSocials("#beach_bar", "with")}
                >
                  <Icons.Share />
                </IconBox>
              </>
            }
          />
          {/* {isProducts && <h5 className="beach_bar__header__name">{data.beachBar.name}</h5>}
            </LayoutIconHeader> */}
          <AnimatePresence exitBeforeEnter>
            {isProducts ? (
              <motion.div
                key={secondQueryParam}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <BeachBar.Product.MainPage
                  barCurrencySymbol={data.beachBar.defaultCurrency.symbol}
                  products={availableProducts}
                />
              </motion.div>
            ) : (
              <>
                <BeachBar {...data.beachBar} reviewScore={reviewScore} products={availableProducts} isPhotos={isPhotos}>
                  <AnimatePresence exitBeforeEnter>
                    {isPhotos && (
                      <motion.div
                        className="beach_bar__photos zi--md w100 h100"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { duration: 0.4 } }}
                        exit={{ opacity: 0, transition: { delay: 0.1, duration: 0.4 } }}
                      >
                        <BeachBar.Photos imgsArr={data.beachBar.imgUrls} />
                      </motion.div>
                    )}
                    {isReviews && (
                      <Modal.Overlay isShown>
                        <motion.div
                          className="beach_bar__reviews h100"
                          initial={{ x: "100%", borderRadius: "96px 0px 0px 96px" }}
                          animate={{
                            x: 0,
                            borderRadius: width <= 540 ? "0px 0px 0px 0px" : "32px 0px 0px 32px",
                            transition: { stiffness: 100 },
                          }}
                          exit={{ x: "100%" }}
                          style={{ maxWidth: "32em" }}
                        >
                          <BeachBar.Review.MainPage beachBar={{ ...data.beachBar }} reviewScore={reviewScore} />
                        </motion.div>
                      </Modal.Overlay>
                    )}
                  </AnimatePresence>
                </BeachBar>
                {/* <AnimatePresence exitBeforeEnter> */}
              </>
            )}
          </AnimatePresence>
        </NextMotionContainer>
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

  const slug = params?.slug?.[0];
  if (slug) await apolloClient.query<BeachBarQuery>({ query: BeachBarDocument, variables: { slug, userVisit: true } });
  else return { redirect: { destination: "/", permanent: true } };

  return { props: { [INITIAL_APOLLO_STATE]: apolloClient.cache.extract() }, revalidate: 5 };
};
