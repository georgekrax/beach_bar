import Layout from "@/components/Layout";
import Next from "@/components/Next";
import { SEARCH_ACTIONS } from "@/components/Search/reducer";
import { SearchInputValuesDocument, useCartQuery } from "@/graphql/generated";
import { initializeApollo, INITIAL_APOLLO_STATE } from "@/lib/apollo";
import { useSearchContext } from "@/utils/contexts";
import { useIsDevice } from "@/utils/hooks";
import { calcCartTotalItems } from "@/utils/payment";
import { dayjsFormat } from "@beach_bar/common";
import { Box, Flex, Heading, SimpleGrid } from "@hashtag-design-system/components";
import Icon from "@hashtag-design-system/icons";
import { GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo, useEffect, useMemo } from "react";
import { UrlObject } from "url";

const SearchForm = dynamic(() => {
  const prom = import("@/components/Search/Form").then(mod => mod.Form);
  return prom;
});
const SearchShowInMap = dynamic(() => {
  const prom = import("@/components/Search/ShowInMap").then(mod => mod.ShowInMap);
  return prom;
});
const NextBadge = dynamic(() => {
  const prom = import("@/components/Next/Badge").then(mod => mod.Badge);
  return prom;
});
const NextDoNotHave = dynamic(() => {
  const prom = import("@/components/Next/DoNotHave").then(mod => mod.DoNotHave);
  return prom;
});
const SearchFilters = dynamic(() => {
  const prom = import("@/components/Search/Filters").then(mod => mod.Filters);
  return prom;
});
const BeachBarSearch = dynamic(() => {
  const prom = import("@/components/BeachBar/Search").then(mod => mod.Search);
  return prom;
});

const SearchPage: React.FC = memo(() => {
  const router = useRouter();
  const { isDesktop, isMobile } = useIsDevice();

  const {
    map,
    inputValue,
    _query: { isBox, redirect, ..._query },
    results: { isLoading, ...results },
    dispatch,
    handleSearch,
  } = useSearchContext();

  const { data: session } = useSession();
  const { data: cartData } = useCartQuery();

  const productsTotal = useMemo(
    () => calcCartTotalItems({ products: cartData?.cart?.products || [], foods: [] }),
    [cartData?.cart.total]
  );
  const searchResults = useMemo(() => {
    return results.filtered.filter(
      ({ hasCapacity, beachBar: { displayRegardlessCapacity } }) => hasCapacity || displayRegardlessCapacity
    );
  }, [results.filtered.length]);
  const formattedVal = useMemo(() => {
    if (!inputValue) return "";
    const { beachBar, country, city, region } = inputValue;
    if (beachBar) return beachBar.name;
    else if (region) return region.name;
    else if (city) return city.name;
    else if (country) return country.name;
  }, [inputValue?.id]);

  const getRedirect = () => {
    let res: string | UrlObject | undefined = redirect;
    if (map.isActive && !res?.toString().includes("map")) {
      dispatch({ type: SEARCH_ACTIONS.SET_STATE, payload: { map: { ...map, isActive: false } } });
    } else if (!redirect?.includes("map")) {
      res = {
        pathname: isMobile && !isBox ? "/search" : "/",
        query: isMobile && !isBox ? { box: "true" } : null,
      };
    }
    return res ?? "/";
  };

  const handleReturn = () => router.push(getRedirect());

  const handleSubmit = async () => {
    if (!map.isActive) await handleSearch();
    else router.push(getRedirect());
  };

  const toggleCart = (bool?: boolean) => {
    dispatch({ type: SEARCH_ACTIONS.TOGGLE_CART, payload: bool !== undefined ? { bool } : undefined });
  };

  useEffect(() => {
    // router.query is empty by default on first render
    const isQueryEmpty = Object.keys(router.query).length === 0;
    if (!isQueryEmpty) handleSearch();
    else {
      const isInitialRenderQueryEmpty = router.asPath.split("?").length <= 1;
      if (isDesktop && isInitialRenderQueryEmpty && !_query.searchId) router.replace("/");
    }
  }, [
    // Object.keys(router.query).length
    _query.searchId,
    _query.searchValue,
    _query.inputId,
    // not date.toString() because it will rerender on sec diff
    _query.date?.format(dayjsFormat.ISO_STRING),
    _query.adults,
    _query.children,
    _query.time.start,
    _query.time.end,
  ]);

  return (
    <Layout
      map
      hasToaster
      shoppingCart
      tapbar={false}
      footer={isBox ? false : undefined}
      container={isBox ? { p: 0 } : undefined}
      header={isBox ? false : { isSticky: false, searchBar: isDesktop }}
    >
      <Next.MotionContainer>
        {isBox ? (
          <SearchForm handleReturn={handleReturn} handleSubmit={handleSubmit} />
      ) : (
          <Box my={8}>
            <Flex justify="space-between" align="center">
              <Flex align="inherit" gap={4}>
                <Next.IconBox
                  aria-label="Return to search"
                  onClick={() =>
                    router.push(redirect ? redirect : isDesktop ? "/" : { pathname: "/search", query: { box: true } })
                  }
                >
                  <Icon.Arrow.Left />
                </Next.IconBox>
                <Heading as="h4" color="gray.800" fontSize="3xl" fontWeight="semibold">
                  {formattedVal}
                </Heading>
              </Flex>
              <Flex align="inherit" gap={2.5}>
                <Next.IconBox aria-label="View your shopping cart" onClick={() => toggleCart(true)}>
                  <Icon.Payment.ShoppingCart />
                </Next.IconBox>
                {productsTotal > 0 && <NextBadge position="top">{productsTotal}</NextBadge>}
                {session?.id && (
                  <Link href={{ pathname: "/account/history" }} prefetch={false}>
                    <Next.IconBox aria-label="View your search history">
                      <Icon.Files.History />
                    </Next.IconBox>
                  </Link>
                )}
              </Flex>
            </Flex>
            <SimpleGrid
              autoFlow="row"
              templateRows="auto 1fr"
              templateColumns={{ md: "max(17em, 27%) 1fr" }}
              mt={{ md: 6 }}
              gap={{ md: 10 }}
              className="search__results"
            >
              <div>
                <SearchShowInMap formattedInputVal={formattedVal} />
                <Box
                  width="100%"
                  position={{ base: "fixed", md: "static" }}
                  left={0}
                  bottom={0}
                  bg="white"
                  zIndex="md"
                  className="search__filters"
                >
                  <SearchFilters allBeachBars={results.arr.map(({ beachBar }) => beachBar)} />
                </Box>
              </div>
              {isLoading || searchResults.length > 0 ? (
                <Flex flexDirection="column">
                  {(isLoading ? [...Array(3).keys()] : searchResults).map((props, i) => (
                    <BeachBarSearch key={"beach_bar_" + i} isLoading={isLoading} {...props} />
                  ))}
                </Flex>
              ) : (
                <NextDoNotHave
                  msg="We're sorry, but we could not find any available #beach_bars that match your criteria."
                  emoji="😔"
                />
              )}
            </SimpleGrid>
          </Box>
        )}
      </Next.MotionContainer>
    </Layout>
  );
});

SearchPage.displayName = "SearchPage";

export default SearchPage;

export const getStaticProps: GetStaticProps = async () => {
  const apolloClient = initializeApollo();

  await apolloClient.query({ query: SearchInputValuesDocument });

  return {
    props: { [INITIAL_APOLLO_STATE]: apolloClient.cache.extract() },
    revalidate: 5 * 60,
  };
};
