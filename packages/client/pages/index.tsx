import { CarouselItemOptions, Item } from "@/components/Carousel";
import FavouriteBeachBars from "@/components/FavouriteBeachBars";
import Layout from "@/components/Layout";
import { IndexPage } from "@/components/pages";
import RecentSearches, { RecentSearchesProps } from "@/components/RecentSearches";
import Search from "@/components/Search";
import {
  GetLatestUserSearchesDocument,
  useGetLatestUserSearchesQuery,
  useGetPersonalizedBeachBarsQuery,
  useGetUserFavouriteBeachBarsQuery,
  useLoginMutation,
  useLogoutMutation,
} from "@/graphql/generated";
import { initializeApollo, INITIAL_APOLLO_STATE } from "@/lib/apollo";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { GetStaticProps } from "next";
import React from "react";

const Index: React.FC = () => {
  // const [adultsValue, setAdultsValue] = useState(1);
  // const [childrenValue, setChildrenValue] = useState(0);
  const { data, error, loading } = useGetPersonalizedBeachBarsQuery();
  const [login] = useLoginMutation({
    variables: { userCredentials: { email: "georgekraxt@gmail.com", password: "george2016" }, loginDetails: undefined },
  });
  const [logout] = useLogoutMutation();
  const { data: favouriteData, loading: favouriteLoading, error: favouriteError } = useGetUserFavouriteBeachBarsQuery();
  const {
    data: recentSearchesData,
    loading: recentSearchesLoading,
    error: recentSearchesError,
  } = useGetLatestUserSearchesQuery();

  if (loading || favouriteLoading || recentSearchesLoading) return <h1>Loading...</h1>;

  if (error || !data || favouriteError || !favouriteData || recentSearchesError || !recentSearchesData)
    return <h2>Error</h2>;

  const generateSlides = (
    query: Exclude<keyof typeof data | keyof typeof favouriteData, "__typename">
  ): CarouselItemOptions[] => {
    let parsedData = data[query];
    if (favouriteData && query === "favouriteBeachBars") {
      parsedData = favouriteData[query].map(data => data.beachBar);
    }
    const slides: CarouselItemOptions[] = parsedData.map(({ id, name, thumbnailUrl, location: { city, region } }) => ({
      id,
      imgProps: {
        src: thumbnailUrl,
      },
      beachBar: {
        name,
        city: city && city.name,
        region: region && region.name,
        isFavourite: favouriteData.favouriteBeachBars.map(({ beachBar: { id } }) => id).includes(id),
      },
    }));

    return slides;
  };

  const recentSearchesBeachBars: RecentSearchesProps["beachBars"] = recentSearchesData.getLatestUserSearches.map(
    ({ id, inputValue, searchAdults, searchChildren, searchDate }) => {
      return {
        id,
        date: searchDate && dayjs(searchDate),
        people: searchAdults + (searchChildren || 0),
        searchValue: inputValue?.beachBar
          ? { beachBar: { name: inputValue.beachBar.name, thumbnailUrl: inputValue.beachBar.thumbnailUrl } }
          : inputValue?.city?.name + (inputValue?.region ? ", " + inputValue.region.name : ""),
      };
    }
  );

  return (
    <Layout>
      <motion.div className="index__container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit="initial">
        <IndexPage.Header
          header={
            <>
              Where would you <span style={{ display: "block" }} /> like to go <span className="normal">next?</span>
            </>
          }
        >
          {({ position, itemsRef, handleClick }) =>
            generateSlides("getPersonalizedBeachBars").map(({ idx, ...props }, i) => (
              <Item
                key={i}
                ref={el => (itemsRef.current[i] = el)}
                idx={i}
                active={i === position}
                onClick={() => handleClick(i)}
                {...props}
              />
            ))
          }
        </IndexPage.Header>
        <Search.Box />
        {/* <Link href="/search?box">
          <motion.div
            className="index__form__container w-100 flex-column-flex-start-stretch"
            initial={false}
            transformTemplate={(_, generated) => {
              if (generated.includes("scale(1,")) return generated.split(" scale(1, ")[0];
              else return generated;
            }}
            layout
            layoutId="search_bar"
          >
            <Input
              suffix={<Icons.Search width={24} height={24} />}
              floatingplaceholder={false}
              placeholder="Search for places"
              style={{ pointerEvents: "none" }}
            />
          </motion.div>
        </Link> */}
        {/* <BottomSheet isShown={isShown} onDismiss={() => setIsShown(false)}>
        <BottomSheet.ScrollBar />
        <Dialog.Content className="index__form__bottom-sheet flex-column-center-stretch">
          <div className="people__container">
            <p>Adults (age 12+)</p>
            <div className="people__quantity flex-row-space-between-center">
              <span className="semibold">{adultsValue}</span>
              <Input.IncrDcr defaultValue={1} min={1} max={12} onValue={value => setAdultsValue(value)} />
            </div>
          </div>
          <div className="hr-vector" />
          <div className="people__container">
            <p>Children (age 0 - 11)</p>
            <div className="people__quantity flex-row-space-between-center">
              <span className="semibold">{childrenValue}</span>
              <Input.IncrDcr defaultValue={0} min={0} max={8} onValue={value => setChildrenValue(value)} />
            </div>
          </div>
        </Dialog.Content>
      </BottomSheet>
      <Input
            suffix={!isFocused && <Icons.Search width={24} height={24} />}
            onFocus={async () => {
              // setIsFocused(true);
              // // await inputAnimation.start({ top: 0, height: "100vh", x: -5, width: "100vw" });
              // const bottom = headerRef.current.getBoundingClientRect().bottom;
              // const top = formRef.current.getBoundingClientRect().top;
              // const hey = top - bottom;
              // headerRef.current.scrollIntoView();
              // await inputAnimation.start(
              //   { y: -hey, height: "100vh", x: "-0.75em", width: "100vw" },
              //   { duration: 0.5 }
              // );
              router.push({ pathname: "/search", query: { box: "" } });
            }}
            onBlur={async () => {
              // setIsFocused(false);
              // await inputAnimation.start({ top: 0, height: "fit-content", x: 0, width: "100%" });
              // await inputAnimation.start({ y: 0, height: "fit-content", x: 0, width: "100%" }, { duration: 0.25 });
              // setIsFocused(false);
            }}
            floatingplaceholder={false}
            placeholder="Search for places..."
          />
          */}
        <FavouriteBeachBars beachBars={generateSlides("favouriteBeachBars")} />
        <RecentSearches beachBars={recentSearchesBeachBars} />
        <div className="flex-row-flex-start-center">
          <button
            onClick={async () => {
              const { data } = await login();
              console.log(data);
            }}
            style={{ marginRight: "2em" }}
          >
            Click me!
          </button>
          <button
            onClick={async () => {
              const { data } = await logout();
              console.log(data);
            }}
          >
            Logout
          </button>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Index;

export const getStaticProps: GetStaticProps = async () => {
  const apolloClient = initializeApollo();

  await apolloClient.query({ query: GetLatestUserSearchesDocument });
  return { props: { [INITIAL_APOLLO_STATE]: apolloClient.cache.extract() } };
};
