import Next from "@/components/Next";
import { DATA } from "@/config/data";
import { BeachBarQuery, useAvailableProductsQuery } from "@/graphql/generated";
import { BeachQueryParams } from "@/typings/beachBar";
import { useConfig, useIsDevice } from "@/utils/hooks";
import { COMMON_CONFIG } from "@beach_bar/common";
import { Box, Button, Flex, useWindowDimensions } from "@hashtag-design-system/components";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { Favourite } from "./Favourite";
import { Feature } from "./Feature";
import { Header } from "./Header";
import { BeachBarHeading } from "./Heading";
import { Img } from "./Img";
import { NameAndLocation } from "./NameAndLocation";
import { Page } from "./Page";
import { Product } from "./Product";
import { Review } from "./Review";
import { Search } from "./Search";
import { Section } from "./Section";

const PRODUCT_LIST_PADDING = 4;

// const Header = dynamic(() => {
//   const prom = import("./Header").then(mod => mod.Header);
//   return prom;
// });
// const NameAndLocation = dynamic(() => {
//   const prom = import("./NameAndLocation").then(mod => mod.NameAndLocation);
//   return prom;
// });
// const Search = dynamic(() => {
//   const prom = import("./Search").then(mod => mod.Search);
//   return prom;
// });

type SubComponents = {
  Header: typeof Header;
  Review: typeof Review;
  NameAndLocation: typeof NameAndLocation;
  Favourite: typeof Favourite;
  Search: typeof Search;
  Img: typeof Img;
  Product: typeof Product;
  Feature: typeof Feature;
  Section: typeof Section;
  Page: typeof Page;
};

export type Props = {
  reviewScore?: typeof COMMON_CONFIG.DATA.searchFilters.REVIEW_SCORES.EXCELLENT;
  isPhotos?: boolean;
  queryParams: BeachQueryParams;
} & NonNullable<BeachBarQuery["beachBar"]>;

const BeachBar: React.FC<Props> & SubComponents = ({
  id,
  slug,
  name,
  description,
  thumbnailUrl,
  location,
  imgUrls,
  reviews,
  avgRating,
  currency,
  features,
  contactPhoneNumber,
  hidePhoneNumber,
  reviewScore,
  isPhotos = false,
  children,
  queryParams: { availability },
  ...props
}) => {
  const { query } = useRouter();
  const { isDesktop } = useIsDevice();
  const { width } = useWindowDimensions();
  const {
    variables: { breakpoints },
  } = useConfig();
  const MAX_IMGS = width >= breakpoints.sm ? DATA.MAX_BEACH_IMGS : 3;

  const { data, loading, error } = useAvailableProductsQuery({
    skip: !availability,
    // @ts-ignore
    variables: { beachBarId: id, availability },
  });

  const sortedFeatures = useMemo(() => {
    return features
      .map(({ __typename, ...rest }) => rest)
      .sort((a, b) => parseInt(a.service.id) - parseInt(b.service.id));
  }, [features.length, features[0]?.id]);
  const hasNoProducts = useMemo(() => data?.availableProducts.length === 0, [data?.availableProducts.length]);

  return (
    <Box
      position="relative"
      my={4}
      style={
        !isPhotos ? undefined : { minHeight: (448 * Math.ceil(imgUrls.length / DATA.PHOTOS_PER_SECTION)) / 16 + "em" }
      }
    >
      <BeachBarHeading name={name} city={location.city.name} display={{ sm: "none" }} />
      <Page.Images name={name} slug={slug} thumbnailUrl={thumbnailUrl} imgUrls={imgUrls} maxImgs={MAX_IMGS} />
      <Page.Details
        slug={slug}
        description={description}
        reviews={reviews}
        avgRating={avgRating}
        reviewScore={reviewScore}
        maxImgs={MAX_IMGS}
      />
      <Page.SearchInfo beachBarId={id} />
      <Flex flexDir={hasNoProducts ? "column" : "row"} align="flex-start" gap={6}>
        <Box
          p={PRODUCT_LIST_PADDING}
          color="white"
          minWidth={{ sm: "67.5%" }}
          maxWidth={hasNoProducts ? "73%" : undefined}
          maxHeight={{ base: "23em", sm: "none" }}
          borderRadius="regular"
          bg="teal.400"
        >
          {loading ? (
            <h2>Loading...</h2>
          ) : error ? (
            <h2>Error</h2>
          ) : hasNoProducts ? (
            "This #beach_bar does not have any available products for the date and times you have selected. Please select from the above available hours."
          ) : (
            <>
              {props.products.map(({ id, ...props }) => (
                <Product
                  key={"product_" + id}
                  id={id}
                  hasComponents={isDesktop}
                  hasAddToCart={isDesktop}
                  hasExtraDetails={isDesktop}
                  defaultCurrencySymbol={currency.symbol}
                  isAvailable={data?.availableProducts.some(product => product.id === id) ?? false}
                  {...props}
                />
              ))}
            </>
          )}
        </Box>
        <Page.Food hasNoProducts={hasNoProducts} foods={props.foods} currencySymbol={currency.symbol} />
      </Flex>
      <Flex
        justify="center"
        align="flex-end"
        position="sticky"
        bottom={0}
        width="100%"
        display={{ sm: "none" }}
        mt="-45%"
        py={6}
        px={PRODUCT_LIST_PADDING}
        pt={16}
        bgGradient="linear(to top, white, transparent)"
      >
        <Next.Link
          width="inherit"
          maxWidth={72}
          link={{
            replace: true,
            shallow: true,
            passHref: true,
            href: {
              pathname: "/beach/[...slug]",
              query: { ...query, slug: [slug, "products"] },
            },
          }}
        >
          <Button colorScheme="orange" height="auto" py={4} width="inherit" color="white">
            View products
          </Button>
        </Next.Link>
      </Flex>
      <Flex wrap="wrap" mt={12} gap={40}>
        <Section header="Facilities">
          <Feature.Container align="flex-start" maxWidth="50vh">
            {sortedFeatures.map(({ quantity, service: { id, name, icon } }) => (
              <Feature key={id} minHeight={10} feature={name} quantity={quantity} iconId={icon.publicId} />
            ))}
          </Feature.Container>
        </Section>
        <Section header="Contact">
          <Section.Contact info="Street address" val={location.address} />
          {location.zipCode && <Section.Contact info="Zip code" val={location.zipCode} />}
          {!hidePhoneNumber && (
            <Section.Contact info="Phone number" val={`(+${location.country.callingCode}) ${contactPhoneNumber}`} />
          )}
        </Section>
      </Flex>
      {/* Check products container padding bottom again */}
      {children}
    </Box>
  );
};

BeachBar.Header = Header;
BeachBar.Review = Review;
BeachBar.NameAndLocation = NameAndLocation;
BeachBar.Favourite = Favourite;
BeachBar.Search = Search;
BeachBar.Img = Img;
BeachBar.Product = Product;
BeachBar.Feature = Feature;
BeachBar.Section = Section;
BeachBar.Page = Page;

BeachBar.displayName = "BeachBar";

export default BeachBar;
