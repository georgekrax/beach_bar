import { BeachBarProps } from "@/components/BeachBar";
import Next from "@/components/Next";
import { IconBox } from "@/components/Next/IconBox";
import Search from "@/components/Search";
import { BeachBarQuery, BeachBarReviewBaseFragment, useVerifyUserPaymentForReviewMutation } from "@/graphql/generated";
import { useSearchContext } from "@/utils/contexts";
import { notify } from "@/utils/notify";
import { filterByRating, formatNumber } from "@/utils/search";
import { verifyPaymentIdSchema } from "@/utils/yup";
import { COMMON_CONFIG, TABLES } from "@beach_bar/common";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  DrawerProps,
  Flex,
  Form,
  Heading,
  Input,
  keyframes,
  MotionBox,
  Select,
  SelectItem,
} from "@hashtag-design-system/components";
import Icon from "@hashtag-design-system/icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { MONTHS } from "@the_hashtag/common";
import { AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { ContentEdit } from "./ContentEdit";
import styles from "./MainPage.module.scss";
import { RatingBox } from "./RatingBox";
import { Review } from "./Review";

const borderRadiusAnimation = keyframes`
  from {
    border-radius: 64px 0px 0px 64px;
  }
  
  to {
    border-radius: 32px 0px 0px 32px;
  }
`;

const {
  searchFilters: { REVIEW_SCORES },
  REVIEW_SCORES_TOP,
} = COMMON_CONFIG.DATA;
const { REVIEW_VISIT_TYPE } = TABLES;

type FormData = {
  refCode: string;
};

type ReviewProperties = Pick<
  BeachBarReviewBaseFragment,
  "positiveComment" | "negativeComment" | "body" | "visitType" | "month"
>;

type Props = Pick<DrawerProps, "isOpen"> & {
  beachBar: Pick<NonNullable<BeachBarQuery["beachBar"]>, "id" | "slug" | "name" | "avgRating" | "reviews">;
} & Pick<BeachBarProps, "reviewScore">;

export const MainPage: React.FC<Props> = ({ isOpen, beachBar: { reviews, ...beachBar }, reviewScore }) => {
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(verifyPaymentIdSchema) });
  const [whichSectionToShow, setWhichSectionToShow] = useState({ verifyId: false, postReview: false });
  const [filteredArr, setFilteredArr] = useState(reviews);

  const [verifyRefCode] = useVerifyUserPaymentForReviewMutation();

  const {
    _query: { filterIds },
    handleFilterIds,
  } = useSearchContext();

  const allReviewScores = useMemo(() => Object.values(REVIEW_SCORES).concat([REVIEW_SCORES_TOP]), []);
  const sortedReviews = useMemo(
    () =>
      Array.from(filteredArr).sort((a, b) => {
        const aUpvotes = a.votes.filter(({ type: { value } }) => value === "upvote").length;
        const bUpvotes = b.votes.filter(({ type: { value } }) => value === "upvote").length;
        const aProperties: ReviewProperties = {
          positiveComment: a.positiveComment,
          negativeComment: a.negativeComment,
          body: a.body,
          visitType: a.visitType,
          month: a.month,
        };
        const bProperties: ReviewProperties = {
          positiveComment: b.positiveComment,
          negativeComment: b.negativeComment,
          body: b.body,
          visitType: b.visitType,
          month: b.month,
        };
        const aPropsLength = Object.values(aProperties).filter(val => val != null && val).length;
        const bPropsLength = Object.values(bProperties).filter(val => val != null && val).length;
        return (bUpvotes > aUpvotes ? 1 : -1) / (bPropsLength > aPropsLength ? 1 : -1) >= 1 ? -1 : 1;
      }),
    [filteredArr]
  );
  const ratingValues = useMemo(() => {
    const uniqRatings = Array.from(new Set(reviews.map(({ ratingValue }) => ratingValue)));
    return allReviewScores.filter(({ rating }) => uniqRatings.includes(rating));
  }, [reviews[0]?.id, reviews.length]);
  const visitTypes = useMemo(() => {
    const uniqVisitTypes = Array.from(
      new Set(reviews.filter(({ visitType }) => visitType?.id !== undefined).map(({ visitType }) => visitType!.id))
    ).map(val => val.toLowerCase());
    return REVIEW_VISIT_TYPE.filter(type => uniqVisitTypes.includes(type.id.toString()));
  }, [reviews[0]?.id, reviews.length]);
  const months = useMemo(() => {
    const uniqMonths = Array.from(
      new Set(reviews.filter(({ month }) => month?.id !== undefined).map(({ month }) => month!.value.toLowerCase()))
    );
    return MONTHS.filter(month => uniqMonths.includes(month.toLowerCase()));
  }, [reviews[0]?.id, reviews.length]);

  const filter = () => {
    let newArr = reviews;
    filterIds.forEach(id => {
      switch (id) {
        case REVIEW_SCORES_TOP.publicId:
        case REVIEW_SCORES.VERY_GOOD.publicId:
        case REVIEW_SCORES.GOOD.publicId:
        case REVIEW_SCORES.DELIGHTFUL.publicId:
        case REVIEW_SCORES.EXCELLENT.publicId:
          const mappedArr = newArr.map(({ __typename, ratingValue, ...rest }) => ({
            ...rest,
            avgRating: ratingValue,
          }));
          newArr = filterByRating<typeof mappedArr[number]>(filterIds, mappedArr, true).map(
            ({ avgRating, ...rest }) => ({ ...rest, ratingValue: avgRating })
          );
          break;
        case REVIEW_VISIT_TYPE.find(({ name }) => name === "Daily bath")?.name:
        case REVIEW_VISIT_TYPE.find(({ name }) => name === "Weekend gateway")?.name:
        case REVIEW_VISIT_TYPE.find(({ name }) => name === "Family")?.name:
        case REVIEW_VISIT_TYPE.find(({ name }) => name === "Couple")?.name:
        case REVIEW_VISIT_TYPE.find(({ name }) => name === "Group of 8+ people")?.name:
          const type = REVIEW_VISIT_TYPE.find(({ name }) => name === id);
          if (type) newArr = newArr.filter(({ visitType }) => visitType?.id === type.id.toString());
          break;
      }

      if (MONTHS.includes(id)) {
        const monthId = (MONTHS.findIndex(val => val === id) + 1).toString();
        if (monthId !== "-1") newArr = newArr.filter(({ month }) => month?.id === monthId);
      }
    });
    setFilteredArr(newArr);
  };

  // const handleClick = (id: string, isChecked: boolean) => {
  //   let newFilterIds: typeof filterIds = [];
  //   if (isChecked) newFilterIds = [...filterIds, id];
  //   else newFilterIds = filterIds.filter(publicId => publicId !== id);
  //   setFilterIds(newFilterIds);
  // };

  const handleSelect = (items: SelectItem[]) => {
    const selected = items.find(({ isSelected }) => isSelected);
    if (selected) handleFilterIds(selected.content);
    else {
      const filtersContent = items.map(({ content }) => content);
      const alreadyFilter = filterIds.find(id => filtersContent.includes(id));
      if (alreadyFilter) handleFilterIds(alreadyFilter);
    }
  };

  const handleRefCodeVerification = async (form: FormData) => {
    const { refCode } = form;
    const { data, errors } = await verifyRefCode({ variables: { beachBarId: beachBar.id, refCode } });
    if (errors) errors.forEach(({ message }) => notify("error", message));
    if (!data?.verifyUserPaymentForReview) {
      notify(
        "error",
        "We are sorry, but you cannot post a review for this payment, because you have not visited it yet."
      );
    } else {
      setWhichSectionToShow({ verifyId: false, postReview: true });
      setValue("refCode", refCode);
    }
  };

  useEffect(filter, [filterIds.length]);
  useEffect(() => setFilteredArr(reviews), [reviews]);

  return (
    <Drawer placement="right" isOpen={isOpen} onClose={() => {}}>
      <DrawerOverlay />
      <DrawerContent
        maxWidth="32em"
        overflow="hidden"
        animation={{ md: `${borderRadiusAnimation} 0.8s ease forwards` }}
      >
        <DrawerBody p={0}>
          <Flex
            justify="space-between"
            align="flex-start"
            py={5}
            px={6}
            sx={{
              "+ div": {
                px: 6,
                height: "calc(100% - 5.5em)",
                overflowY: "auto",
                borderRadius: "inherit",
              },
            }}
          >
            <Flex gap={4} align="center">
              {whichSectionToShow.verifyId || whichSectionToShow.postReview ? (
                <IconBox
                  aria-label="View all #beach_bar reviews."
                  onClick={() => setWhichSectionToShow({ verifyId: false, postReview: false })}
                >
                  <Icon.Arrow.Left />
                </IconBox>
              ) : (
                <Next.Link
                  color="black"
                  link={{
                    shallow: true,
                    replace: true,
                    scroll: false,
                    href: { pathname: "/beach/[...slug]", query: { slug: [beachBar.slug] } },
                  }}
                >
                  <IconBox aria-label="Return to #beach_bar details.">
                    <Icon.Arrow.Left />
                  </IconBox>
                </Next.Link>
              )}
              <h5>{beachBar.name}</h5>
            </Flex>
            {!whichSectionToShow.verifyId && !whichSectionToShow.postReview && (
              <Button onClick={() => setWhichSectionToShow(prev => ({ ...prev, verifyId: true }))}>Post review</Button>
            )}
          </Flex>
          {whichSectionToShow.verifyId || whichSectionToShow.postReview ? (
            <AnimatePresence exitBeforeEnter>
              {whichSectionToShow.verifyId && (
                <MotionBox
                  as="form"
                  key="verifyIdForm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: "-200%" }}
                  transition={{ duration: 0.4 }}
                  px={6}
                  onSubmit={handleSubmit(handleRefCodeVerification)}
                >
                  <Box mb={5} color="text.grey">
                    Please enter the #ID of your trip you made to this #beach_bar, in order to post a review
                  </Box>
                  <Form.Control isInvalid={!!errors.refCode}>
                    <Input id="refCode" placeholder="Payment ID" maxLength={16} {...register("refCode")} />
                    <Form.ErrorMessage>{errors.refCode && errors.refCode.message}</Form.ErrorMessage>
                    <Form.HelperText>TODO: Check character limit on design_system package</Form.HelperText>
                  </Form.Control>
                  <Button type="submit" mt={8} colorScheme="orange">
                    Verify ID
                  </Button>
                </MotionBox>
              )}
              {whichSectionToShow.postReview && (
                <MotionBox
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ stiffness: 100 }}
                  className="scrollbar"
                  px={6}
                >
                  <ContentEdit
                    hasNone={false}
                    beachBar={beachBar}
                    refCode={watch("refCode")}
                    onSubmit={() => setWhichSectionToShow({ postReview: false, verifyId: false })}
                  />
                </MotionBox>
              )}
            </AnimatePresence>
          ) : reviews.length > 0 ? (
            <div className="scrollbar">
              <Flex align="center" gap={3} mt={8}>
                <RatingBox atBeach avgRating={beachBar.avgRating} />
                <div>
                  <Heading as="h5" size="md" color="gray.800">
                    {reviewScore?.name}
                  </Heading>
                  <Box color="gray.500">{formatNumber(reviews.length)} reviews</Box>
                </div>
              </Flex>
              <Box my={6} pb={6} borderBottom="1px solid" borderColor="gray.400" className={styles.filtersContainer}>
                <Search.Filters.ReviewScores
                  header=""
                  greaterThan={false}
                  arr={ratingValues}
                  sx={{ "& > div": { mb: 3 } }}
                />
                <Flex align="center" wrap="wrap" gap={4}>
                  <Select onSelect={handleSelect}>
                    <Select.Btn minWidth={{ base: "8em", md: "12em" }}>Visit type</Select.Btn>
                    <Select.Modal>
                      <Select.Options>
                        {visitTypes.map(({ id, name }, i) => (
                          <Select.Item key={i} id={id.toString()}>
                            {name}
                          </Select.Item>
                        ))}
                      </Select.Options>
                    </Select.Modal>
                  </Select>
                  <Select onSelect={items => handleSelect(items)}>
                    <Select.Btn minWidth={148}>Visit month</Select.Btn>
                    <Select.Modal>
                      <Select.Options>
                        {months.map((val, i) => (
                          <Select.Item key={i} id={val + "_" + i}>
                            {val}
                          </Select.Item>
                        ))}
                      </Select.Options>
                    </Select.Modal>
                  </Select>
                </Flex>
              </Box>
              <Box>
                {sortedReviews.map(({ id, ...review }) => (
                  <Review
                    key={id}
                    atBeach
                    hasExpandedContent
                    beachBar={beachBar}
                    id={id}
                    {...review}
                    container={{ mb: 7 }}
                  />
                ))}
              </Box>
            </div>
          ) : (
            <Next.DoNotHave msg="This #beach_bar, does not seem to have any reviews yet." />
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

MainPage.displayName = "BeachBarReviewMainPage";
