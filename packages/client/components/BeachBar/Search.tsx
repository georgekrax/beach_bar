import Icons from "@/components/Icons";
import Loading from "@/components/Loading";
import Next from "@/components/Next";
import { SearchQuery } from "@/graphql/generated";
import { useSearchContext } from "@/utils/contexts";
import { genBarThumbnailAlt, genReviewRating } from "@/utils/format";
import { calcDist } from "@/utils/search";
import { AspectRatio, Box, Flex, Heading, Text } from "@hashtag-design-system/components";
import Image from "next/image";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { Feature } from "./Feature";
import { Favourite } from "./Favourite";
import styles from "./Search.module.scss";

const HEARTBOX_CLASSNAME = "heartbox";

type Props = {
  isLoading?: boolean;
};

export const Search: React.FC<Props & SearchQuery["search"]["results"][number]> = ({
  hasCapacity,
  totalPrice,
  isLoading = false,
  recommendedProducts,
  beachBar,
}) => {
  const { query } = useRouter();
  const { inputValue, coordinates } = useSearchContext();

  const {
    distance,
    ratingInfo,
    showRecommended,
  }: { distance: number; ratingInfo: ReturnType<typeof genReviewRating>; showRecommended: boolean } = useMemo(() => {
    if (isLoading) return { distance: 0, ratingInfo: { floored: 0, val: 0 }, showRecommended: false };
    return {
      distance: beachBar.location ? calcDist(coordinates, beachBar.location) : 0,
      ratingInfo: genReviewRating(+beachBar.avgRating),
      showRecommended: recommendedProducts.length >= 1 && hasCapacity,
    };
  }, [isLoading, beachBar?.avgRating]);
  const locationVal = useMemo(() => {
    if (isLoading) return "";
    const { city, region } = beachBar.location || {};
    let newVal: string[] = [];
    if (inputValue?.city && region) newVal.push(region.name);
    else if (inputValue?.country && !inputValue.city && !inputValue.region && city) newVal.push(city.name);
    return newVal.join(", ").trimEnd();
  }, [isLoading]);

  const sortedFeatures = useMemo(
    () => (isLoading ? [] : Array.from(beachBar.features).sort((a, b) => b.quantity - a.quantity)),
    [isLoading, beachBar?.features.length]
  );

  const handleLinkClick: React.MouseEventHandler<HTMLAnchorElement> = e => {
    const isHeartBox = (e.target as HTMLDivElement).closest("." + HEARTBOX_CLASSNAME);
    if (isHeartBox) e.preventDefault();
  };

  const isUnavailable = !hasCapacity && !isLoading;

  // if (isLoading) return <div>Loading...</div>

  return (
    <Next.Link
      mb={10}
      _last={{ mb: "7em" }}
      onClick={handleLinkClick}
      link={{
        href: { pathname: "/beach/[...slug]", query: isLoading ? undefined : { ...query, slug: [beachBar.slug] } },
      }}
    >
      <Flex
        flexDir={{ base: "column", md: "row" }}
        align="stretch"
        border="1px solid"
        borderColor="gray.400"
        borderRadius="regular"
        minHeight={{ base: "22.5em", md: 48 }}
        bg={isUnavailable ? "gray.200" : "white"}
        opacity={isUnavailable ? 0.75 : 1}
        transitionProperty="common"
        transitionDuration="normal"
        transitionTimingFunction="ease-in-out"
        _hover={{ bg: "gray.100" }}
      >
        <AspectRatio
          ratio={4 / 3}
          position="relative"
          width="100%"
          flexShrink={{ base: 0, md: 1 }}
          transform={{ base: "scale(1.01)", md: "scale(1.05)" }}
          borderRadius="inherit"
          overflow="hidden"
          minHeight={{ base: 192, md: "auto" }}
          maxWidth={{ md: 48 }}
          className={styles.imgContainer}
        >
          <Loading height="100%" isLoading={isLoading || !beachBar.thumbnailUrl}>
            {hasLoaded =>
              hasLoaded && (
                <Image
                  // TODO: add priority if i <= 3
                  priority
                  src={beachBar.thumbnailUrl!}
                  alt={genBarThumbnailAlt(beachBar.name)}
                  layout="fill"
                  objectFit="cover"
                  objectPosition="center"
                />
              )
            }
          </Loading>
        </AspectRatio>
        <Flex
          flexDir="column"
          justify="space-between"
          width="100%"
          p={4}
          pt={{ base: 5, md: 4 }}
          pl={{ md: 7 }}
          alignSelf="stretch"
          className={styles.content}
        >
          <div>
            <Flex justify="space-between" align="center" width="100%" className={styles.header}>
              <Box width="100%">
                <Loading.Text minHeight={6} mb={3} isLoading={isLoading}>
                  {hasLoaded =>
                    hasLoaded && (
                      <Flex align="flex-end">
                        <Heading as="h5" color="text.grey" fontSize="xl" fontWeight="semibold">
                          {beachBar.name}
                        </Heading>
                        <Box ml={2} color="gray.400">
                          {locationVal && locationVal + ", "}
                          <Text as="span" fontSize="sm">
                            {distance <= 15 ? distance.toFixed(1) : Math.round(distance)}km
                          </Text>
                        </Box>
                      </Flex>
                    )
                  }
                </Loading.Text>
                <Flex align="center" className={styles.reviewsScore + " body-14 text--grey"}>
                  <Icons.Star className={"rating--" + (isLoading ? 3 : ratingInfo.floored)} width={16} height={16} />
                  <Loading.Text width="35%" isLoading={isLoading}>
                    {hasLoaded =>
                      hasLoaded && (
                        <>
                          <div>{ratingInfo.val}</div>
                          <span>&nbsp;({beachBar.reviews.length})</span>
                        </>
                      )
                    }
                  </Loading.Text>
                </Flex>
              </Box>
              {!isLoading && (
                <Favourite.HeartBox bg="white" beachBarSlug={beachBar.slug} className={HEARTBOX_CLASSNAME} />
              )}
            </Flex>
            {showRecommended && (
              <div className={styles.recommendedProducts}>
                <span className="d--block" />
                <Box color="text.grey" fontSize="sm">
                  {recommendedProducts.map(({ product: { id, name, maxPeople }, quantity }) => (
                    <Flex align="center" key={"recommended_product_" + id} className={styles.product}>
                      {(quantity > 1 || recommendedProducts.length > 1) && (
                        <div className={styles.quantity + " body-12"}>
                          <span className="semibold">{quantity}x</span>
                        </div>
                      )}
                      <span>
                        {name} &#8208; {maxPeople}x
                      </span>
                      <Icons.UserAvatar.Filled width={14} height={14} />
                    </Flex>
                  ))}
                </Box>
              </div>
            )}
          </div>
          <Flex justify="space-between" align="flex-end">
            <Loading.Text isLoading={isLoading}>
              {hasLoaded =>
                hasLoaded && (
                  <Box fontSize="sm">
                    <Feature.Container gap={0}>
                      {sortedFeatures.map(({ quantity, service: { id, name } }) => (
                        <Feature key={id} atSearch quantity={quantity} feature={name} />
                      ))}
                    </Feature.Container>
                    {isUnavailable && (
                      <Text as="span" display="block" mt={2} color="error" fontWeight="semibold">
                        This #beach_bar is unavailable
                      </Text>
                    )}
                  </Box>
                )
              }
            </Loading.Text>
            <Loading.Text width="30%" ml={16} minHeight={8} isLoading={isLoading}>
              {hasLoaded =>
                hasLoaded &&
                showRecommended && (
                  <Text as="span" fontWeight="bold" color="gray.700" className="header-6">
                    {totalPrice === 0 ? (
                      "Free"
                    ) : (
                      <>
                        {totalPrice.toFixed(2)}
                        {beachBar.currency.symbol}
                      </>
                    )}
                  </Text>
                )
              }
            </Loading.Text>
          </Flex>
        </Flex>
      </Flex>
    </Next.Link>
  );
};

Search.displayName = "BeachBarSearch";
