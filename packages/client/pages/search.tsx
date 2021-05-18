import Icons from "@/components/Icons";
import Layout from "@/components/Layout";
import { LayoutIconHeader } from "@/components/Layout/IconHeader";
import { SEARCH_ACTIONS } from "@/components/Search/reducer";
import { SearchInputValuesDocument, useCartQuery } from "@/graphql/generated";
import { initializeApollo, INITIAL_APOLLO_STATE } from "@/lib/apollo";
import { useSearchContext } from "@/utils/contexts";
import { useAuth, useIsDesktop, useSearchForm } from "@/utils/hooks";
import { calcCartTotalProducts } from "@/utils/payment";
import { GetStaticProps } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { Toaster } from "react-hot-toast";
import { UrlObject } from "url";

const SearchForm = dynamic(() => {
  const prom = import("@/components/Search/Form").then(mod => mod.Form);
  return prom;
});
const SearchShowInMap = dynamic(() => {
  const prom = import("@/components/Search/ShowInMap").then(mod => mod.ShowInMap);
  return prom;
});
const SearchFilters = dynamic(() => {
  const prom = import("@/components/Search/Filters").then(mod => mod.Filters);
  return prom;
});
const NextMotionContainer = dynamic(() => {
  const prom = import("@/components/Next/MotionContainer").then(mod => mod.NextMotionContainer);
  return prom;
});
const NextIconBox = dynamic(() => {
  const prom = import("@/components/Next/IconBox").then(mod => mod.IconBox);
  return prom;
});
const NextBadge = dynamic(() => {
  const prom = import("@/components/Next/Badge").then(mod => mod.Badge);
  return prom;
});
const NextMarginedHeader = dynamic(() => {
  const prom = import("@/components/Next/MarginedHeader").then(mod => mod.MarginedHeader);
  return prom;
});
const NextDoNotHave = dynamic(() => {
  const prom = import("@/components/Next/DoNotHave").then(mod => mod.DoNotHave);
  return prom;
});
const BeachBarSearch = dynamic(() => {
  const prom = import("@/components/BeachBar/Search").then(mod => mod.Search);
  return prom;
});

const SearchPage: React.FC = () => {
  const router = useRouter();
  const isDesktop = useIsDesktop();

  const { id, inputValue, results, map, dispatch } = useSearchContext();
  const { queryId, isBox, redirect, handleSearch } = useSearchForm();

  const { data } = useAuth();
  const { data: cartData } = useCartQuery();

  const productsTotal = useMemo(() => calcCartTotalProducts(cartData?.cart?.products), [cartData]);
  const formattedVal = useMemo(() => {
    if (!inputValue) return "";
    const { beachBar, country, city, region } = inputValue;
    if (beachBar) return beachBar.name;
    else if (region) return region.name;
    else if (city) return city.name;
    else if (country) return country.name;
  }, [inputValue]);

  const getRedirect = () => {
    let res: string | UrlObject | undefined = redirect;
    if (map.isActive && !res?.toString().includes("map"))
      dispatch({ type: SEARCH_ACTIONS.SET_STATE, payload: { map: { ...map, isActive: false } } });
    else if (!redirect?.includes("map"))
      res = {
        pathname: !isDesktop && !isBox ? "/search" : "/",
        query: !isDesktop && !isBox ? { box: "true" } : null,
      };
    return res ?? "/";
  };

  const handleReturn = () => router.push(getRedirect());

  const handleSubmit = async () => {
    if (!map.isActive) await handleSearch();
    else router.push(getRedirect());
  };

  const toggleCart = (bool?: boolean) =>
    dispatch({ type: SEARCH_ACTIONS.TOGGLE_CART, payload: bool !== undefined ? { bool } : undefined });

  useEffect(() => {
    console.log(inputValue);
    console.log(isDesktop);
    console.log(queryId);
    if (!inputValue && isDesktop && !queryId) router.replace("/");
  }, [isDesktop]);

  useEffect(() => {
    if (queryId && results.arr.length === 0) handleSearch();
  }, [queryId]);
  console.log(results.filtered);
  console.log("searchId", id);

  return (
    <Layout
      header={isBox ? false : { searchBar: isDesktop }}
      footer={isBox ? false : undefined}
      tapbar={false}
      container={isBox ? { style: { padding: 0 } } : undefined}
      shoppingCart
    >
      {false ? (
        <h2>Loading...</h2>
      ) : false ? (
        <h2>Error</h2>
      ) : (
        <NextMotionContainer>
          <Toaster position="top-center" />
          {isBox ? (
            <SearchForm handleReturn={handleReturn} handleSubmit={handleSubmit} />
          ) : (
            <div className="search__container">
              <LayoutIconHeader
                before={
                  <NextIconBox
                    aria-label="Return to search"
                    onClick={() =>
                      router.push(redirect ? redirect : isDesktop ? "/" : { pathname: "/search", query: { box: true } })
                    }
                  >
                    <Icons.Arrow.Left />
                  </NextIconBox>
                }
                after={
                  <>
                    <div style={{ position: "relative" }}>
                      <NextIconBox aria-label="View your shopping cart" onClick={() => toggleCart(true)}>
                        <Icons.ShoppingCart />
                      </NextIconBox>
                      {productsTotal > 0 && <NextBadge position="top">{productsTotal}</NextBadge>}
                      {/* {cartProducts.length > 0 && <Next.Badge position="top">{cartProduct.length}</Next.Badge>} */}
                    </div>
                    {data?.me && (
                      <Link href={{ pathname: "/account/history" }} prefetch={false}>
                        <NextIconBox aria-label="View your search history">
                          <Icons.History />
                        </NextIconBox>
                      </Link>
                    )}
                  </>
                }
              />
              <NextMarginedHeader>{formattedVal}</NextMarginedHeader>
              <div className="search__results">
                <div>
                  <SearchShowInMap formattedInputVal={formattedVal} />
                  <div className="search__filters w100 zi--md">
                    <SearchFilters allBeachBars={results.arr.map(({ beachBar }) => beachBar)} />
                  </div>
                </div>
                {results.filtered.length > 0 ? (
                  <div className="flex-column-flex-start-flex-start">
                    {results.filtered.map(props => (
                      <BeachBarSearch key={props.beachBar.id} {...props} />
                    ))}
                    {results.filtered[0] && <BeachBarSearch key={1} {...results.filtered[0]} />}
                    {results.filtered[0] && <BeachBarSearch key={2} {...results.filtered[0]} />}
                  </div>
                ) : (
                  <NextDoNotHave
                    msg="We're sorry, but we could not find any available #beach_bar for your destination"
                    emoji="😔"
                  />
                )}
              </div>
            </div>
          )}
        </NextMotionContainer>
      )}
    </Layout>
  );
};

SearchPage.displayName = "SearchPage";

export default SearchPage;

export const getStaticProps: GetStaticProps = async () => {
  const apolloClient = initializeApollo();

  await apolloClient.query({ query: SearchInputValuesDocument });

  return {
    props: { [INITIAL_APOLLO_STATE]: apolloClient.cache.extract() },
    revalidate: 60,
  };
};
