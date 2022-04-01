import Next from "@/components/Next";
import { formatNumber } from "@/utils/search";
import { Box, Flex, Text } from "@hashtag-design-system/components";
import Icon from "@hashtag-design-system/icons";
import uniq from "lodash/uniq";
import Image from "next/image";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { BeachBarProps } from "../index";
import { Props as BeachBarPageProps } from "./Images";

const SHRINKED_DESCRIPTION_LENGTH = 720;

type Props = Pick<BeachBarPageProps, "maxImgs"> &
  Pick<NonNullable<BeachBarProps>, "slug" | "description" | "reviews" | "avgRating" | "reviewScore">;

export const Details: React.FC<Props> = ({ slug, description, reviews, avgRating, reviewScore, maxImgs }) => {
  const { query } = useRouter();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const { imgUrls, reviewsLength } = useMemo(() => {
    const imgUrls = uniq(
      reviews
        .map(({ customer: { user } }) => user?.account?.imgUrl || [])
        .flat()
        .slice(0, maxImgs)
    );
    let reviewsLength = reviews.length;
    if (reviewsLength >= 10) {
      const tens = Math.pow(10, reviewsLength.toString().length - 1);
      reviewsLength = Math.floor(reviewsLength / tens) * tens;
    }
    return { imgUrls, reviewsLength };
  }, [reviews.length, reviews[0]?.id, maxImgs, avgRating]);

  const { sliced, isLess, isMore } = useMemo(() => {
    let res = { sliced: description?.slice(0, SHRINKED_DESCRIPTION_LENGTH), isMore: true, isLess: false };
    if ((description?.length || 0) < SHRINKED_DESCRIPTION_LENGTH) res.isMore = false;
    if (!res.isMore) res.sliced = description;
    if (isDescriptionExpanded) res = { sliced: description, isMore: false, isLess: true };
    return res;
  }, [description, isDescriptionExpanded]);

  return (
    <Flex flexDir={{ base: "column", md: "row-reverse" }} align="flex-start" mt={{ md: 4 }}>
      {reviews.length > 0 && (
        // <Link href={{ pathname: "/beach/[slug]/reviews", query: { slug } }} replace prefetch={false}>
        <Flex
          flexDir="column"
          justify="center"
          flex={{ md: "1 0 15.6rem" }}
          mt={{ base: 4, md: "inherit" }}
          mb={4}
          ml={{ md: 8 }}
          p={4}
          border="2px solid"
          borderColor="gray.300"
          borderRadius="regular"
        >
          <Flex justify="space-between" align="center">
            <Box color="text.grey" fontWeight="semibold">
              <span className="bold header-5">{avgRating.toFixed(1)}</span>
              {reviewScore && (
                <Text as="span" ml={2}>
                  {reviewScore.name}
                </Text>
              )}
            </Box>
            <Flex justify="flex-end" align="inherit" ml="-15%">
              {imgUrls.map((imgUrl, i) => (
                <Flex
                  key={i}
                  justify="center"
                  align="center"
                  mr={i !== imgUrls.length - 1 ? "-15%" : undefined}
                  borderRadius="100%"
                  border="3px solid"
                  borderColor="white"
                  zIndex={imgUrls.length - i}
                  sx={{ "& > *": { borderRadius: "100%" } }}
                >
                  <Image src={imgUrl} alt="Review's image" width={32} height={32} objectFit="fill" />
                </Flex>
              ))}
            </Flex>
          </Flex>
          <Flex align="center" mt={2}>
            <Next.Link
              fontSize="sm"
              link={{
                replace: true,
                shallow: true,
                passHref: true,
                href: { pathname: "/beach/[...slug]", query: { ...query, slug: [slug, "reviews"] } },
              }}
            >
              View {reviews.length > reviewsLength ? "+" : ""}
              {formatNumber(reviewsLength)} review{reviewsLength > 1 ? "s" : ""}
              <Icon.Chevron.Right boxSize="14px" ml={1} transform="translateY(-10%)" />
            </Next.Link>
          </Flex>
        </Flex>
        // </Link>
      )}
      <Box mt={{ base: 3, md: "inherit" }} color="text.grey">
        {sliced}
        {isMore ? (
          <>
            <span>...&nbsp;</span>
            <Next.Link onClick={() => setIsDescriptionExpanded(true)}>read more</Next.Link>
          </>
        ) : (
          isLess && <Next.Link onClick={() => setIsDescriptionExpanded(false)}>&nbsp;Read less</Next.Link>
        )}
      </Box>
    </Flex>
  );
};

Details.displayName = "BeachBarPageDetails";
