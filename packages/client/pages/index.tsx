import { Input, useConfigContext, useHasMounted } from "@hashtag-design-system/components";
import { motion, useAnimation } from "framer-motion";
import range from "lodash/range";
import { useMemo, useRef, useState } from "react";
import BeachBarCarousel, { CarouselItemOptions } from "../components/BeachBarCarousel";
import FavouriteBeachBars from "../components/FavouriteBeachBars";
import Layout from "../components/Layout";
import RecentSearches from "../components/RecentSearches";

// const query = graphql`
//   query pages_indexQuery {
//     hello
//   }
// `;

// export const getStaticProps: GetStaticProps<{ data: pages_indexQuery["response"] }> = async context => {
//   const { environment, relaySSR } = initEnvironment();

//   await fetchQuery<pages_indexQuery>(environment, query, {});
//   const relayData = (await relaySSR.getCache())?.[0];

//   return {
//     props: {
//       data: !relayData ? null : relayData[1].data,
//     },
//   };
// };

const Index: React.FC = () => {
  const [isShown, setIsShown] = useState(false);
  const slides = useMemo(
    (): CarouselItemOptions[] =>
      range(0, 7).map(num => ({
        // imgProps: { src: "https://source.unsplash.com/user/erondu/1600x900" },
        imgProps: {
          src:
            "https://images.unsplash.com/photo-1533105079780-92b9be482077?ixid=MXwxMjA3fDB8MHxzZWFyY2h8Nnx8Z3JlZWNlfGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        },
        beachBar: {
          name: "Kikabu",
          city: "Mykonos",
          region: "Chora",
        },
      })),
    []
  );
  const [data, setData] = useState("");
  const [hasMounted] = useHasMounted();
  const [adultsValue, setAdultsValue] = useState(1);
  const [childrenValue, setChildrenValue] = useState(0);
  const inputAnimation = useAnimation();
  const [isFocused, setIsFocused] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const {
    colors: { grey },
  } = useConfigContext();

  return (
    <Layout>
      <motion.div className="index__container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit="initial">
        <div ref={headerRef} className="index__header">
          <h4 id="hey">
            Where do you <span style={{ display: "block" }} /> want to go next?
          </h4>
          {/* <p>Places you will love for your next visit</p> */}
        </div>
        <BeachBarCarousel slides={slides} />
        {data}
        <div style={{ position: isFocused ? "static" : "relative", minHeight: 56 }}>
          <motion.div
            ref={formRef}
            // initial={{ top: 0 }}
            style={{
              backgroundColor: "white",
              // backgroundColor: "transparent",
              // backdropFilter: "blur(10px)",
              // position: "absolute",
              top: 0,
              paddingRight: "1.5em",
              boxShadow: isFocused ? "none" : `0 4px 1rem ${grey["500"]}`,
            }}
            animate={inputAnimation}
            className="index__form__container w-100 flex-column-flex-start-stretch"
          >
            {/* <DatePicker
            selectBtn={({ selectedDate }) => <Select.Button>{selectedDate[0].format("DD/MM/YYYY")}</Select.Button>}
          /> */}
            {/* <Button variant="secondary" onClick={() => setIsShown(true)}>
            6 Adults
          </Button> */}
            <Input
              onFocus={async () => {
                setIsFocused(true);
                // await inputAnimation.start({ top: 0, height: "100vh", x: -5, width: "100vw" });
                const bottom = headerRef.current.getBoundingClientRect().bottom;
                const top = formRef.current.getBoundingClientRect().top;
                const hey = top - bottom;
                headerRef.current.scrollIntoView();
                await inputAnimation.start(
                  { y: -hey, height: "100vh", x: "-0.75em", width: "100vw" },
                  { duration: 0.5 }
                );
              }}
              onBlur={async () => {
                // setIsFocused(false);
                // await inputAnimation.start({ top: 0, height: "fit-content", x: 0, width: "100%" });
                await inputAnimation.start({ y: 0, height: "fit-content", x: 0, width: "100%" }, { duration: 0.25 });
                setIsFocused(false);
              }}
              floatingplaceholder={false}
              placeholder="Search for places..."
            />
          </motion.div>
        </div>
        {/* <Autosuggest placeholder="Filter">
        <Select.Countries />
      </Autosuggest> */}
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
      </BottomSheet> */}
        <FavouriteBeachBars />
        <RecentSearches />
      </motion.div>
    </Layout>
  );
};

export default Index;
