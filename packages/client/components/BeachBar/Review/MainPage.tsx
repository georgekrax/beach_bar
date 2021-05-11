import BeachBar, { BeachBarProps, ReviewFormData } from "@/components/BeachBar";
import Icons from "@/components/Icons";
import { LayoutIconHeader } from "@/components/Layout/IconHeader";
import { NextDoNotHave } from "@/components/Next/DoNotHave";
import { IconBox } from "@/components/Next/IconBox";
import Search from "@/components/Search";
import { DATA } from "@/config/data";
import {
  BeachBarDocument,
  BeachBarQuery,
  ReviewFragment,
  useAddReviewMutation,
  useVerifyUserPaymentForReviewMutation,
} from "@/graphql/generated";
import { notify } from "@/utils/notify";
import { filterByRating, formatNumber } from "@/utils/search";
import { verifyPaymentIdSchema } from "@/utils/yup";
import { COMMON_CONFIG } from "@beach_bar/common";
import { Button, Input, Select, SelectedItems } from "@hashtag-design-system/components";
import { yupResolver } from "@hookform/resolvers/yup";
import { MONTHS } from "@the_hashtag/common";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useController, useForm } from "react-hook-form";
import styles from "./MainPage.module.scss";

const {
  searchFilters: { REVIEW_SCORES },
  REVIEW_SCORES_TOP,
} = COMMON_CONFIG.DATA;
const { REVIEW_VISIT_TYPES } = DATA;

type FormData = {
  refCode: string;
};

type ReviewProperties = Pick<ReviewFragment, "positiveComment" | "negativeComment" | "review" | "visitType" | "month">;

type Props = {
  beachBar: Pick<NonNullable<BeachBarQuery["beachBar"]>, "id" | "slug" | "name" | "avgRating" | "reviews">;
} & Pick<BeachBarProps, "reviewScore">;

export const MainPage: React.FC<Props> = ({ beachBar: { id, name, slug, avgRating, reviews }, reviewScore }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(verifyPaymentIdSchema) });
  const { field: refCode } = useController<FormData, "refCode">({ name: "refCode", control });
  const [whichSectionToShow, setWhichSectionToShow] = useState({ verifyId: false, postReview: false });
  const [formData, setFormData] = useState<ReviewFormData & { refCode: string }>({ refCode: "", rating: 3 });
  const [filteredArr, setFilteredArr] = useState(reviews);
  const [filterIds, setFilterIds] = useState<string[]>([]);

  const [verifyRefCode] = useVerifyUserPaymentForReviewMutation();
  const [postReview] = useAddReviewMutation();

  const allReviewScores = useMemo(() => Object.values(REVIEW_SCORES).concat([REVIEW_SCORES_TOP]), []);
  const sortedReviews = useMemo(
    () =>
      Array.from(reviews).sort((a, b) => {
        const aUpvotes = a.votes.filter(({ type: { value } }) => value === "upvote").length;
        const bUpvotes = b.votes.filter(({ type: { value } }) => value === "upvote").length;
        const aProperties: ReviewProperties = {
          positiveComment: a.positiveComment,
          negativeComment: a.negativeComment,
          review: a.review,
          visitType: a.visitType,
          month: a.month,
        };
        const bProperties: ReviewProperties = {
          positiveComment: b.positiveComment,
          negativeComment: b.negativeComment,
          review: b.review,
          visitType: b.visitType,
          month: b.month,
        };
        const aPropsLength = Object.values(aProperties).filter(val => val !== null && val !== undefined && val).length;
        const bPropsLength = Object.values(bProperties).filter(val => val !== null && val !== undefined && val).length;
        return (bUpvotes > aUpvotes ? 1 : -1) / (bPropsLength > aPropsLength ? 1 : -1) >= 1 ? -1 : 1;
      }),
    [filteredArr]
  );
  const ratingValues = useMemo(() => {
    const uniqRatings = Array.from(new Set(reviews.map(({ ratingValue }) => ratingValue)));
    return allReviewScores.filter(({ rating }) => uniqRatings.includes(rating));
  }, [reviews]);
  const visitTypes = useMemo(() => {
    const uniqVisitTypes = Array.from(
      new Set(reviews.filter(({ visitType }) => visitType?.id !== undefined).map(({ visitType }) => visitType!.id))
    ).map(val => val.toLowerCase());
    return Object.values(REVIEW_VISIT_TYPES).filter(type => uniqVisitTypes.includes(type.id.toString()));
  }, [reviews]);
  const months = useMemo(() => {
    const uniqMonths = Array.from(
      new Set(reviews.filter(({ month }) => month?.id !== undefined).map(({ month }) => month!.value.toLowerCase()))
    );
    return MONTHS.filter(month => uniqMonths.includes(month.toLowerCase()));
  }, [reviews]);

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
          newArr = filterByRating<typeof mappedArr[number]>(
            filterIds,
            mappedArr,
            true
          ).map(({ avgRating, ...rest }) => ({ ...rest, ratingValue: avgRating }));
          break;
        case REVIEW_VISIT_TYPES.DAILY_BATH.name:
        case REVIEW_VISIT_TYPES.WEEKEND_GATEWAY.name:
        case REVIEW_VISIT_TYPES.FAMILY.name:
        case REVIEW_VISIT_TYPES.COUPLE.name:
        case REVIEW_VISIT_TYPES.GROUP_OF_8PLUS_PEOPLE.name:
          const type = Object.values(REVIEW_VISIT_TYPES).find(({ name }) => name === id);
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

  const handleClick = (id: string, isChecked: boolean) => {
    let newFilterIds: typeof filterIds = [];
    if (isChecked) newFilterIds = [...filterIds, id];
    else newFilterIds = filterIds.filter(publicId => publicId !== id);
    setFilterIds(newFilterIds);
  };

  const handleSelect = (items: SelectedItems[]) => {
    const selected = items.find(({ selected }) => selected);
    if (!selected) {
      setFilterIds(prev => prev.filter(id => !items.map(({ content }) => content).includes(id)));
      return;
    }
    let name = selected.content;
    setFilterIds(prev =>
      [...prev, name].filter(
        val =>
          !items
            .filter(({ selected }) => !selected)
            .map(({ content }) => content)
            .includes(val)
      )
    );
  };

  const handleRefCodeVerification = async (form: FormData) => {
    const { refCode } = form;
    const { data, errors } = await verifyRefCode({ variables: { beachBarId: id, refCode } });
    if (errors) errors.forEach(({ message }) => notify("error", message));
    if (!data)
      notify(
        "error",
        "We are sorry, but you cannot post a review for this payment, because you have not visited it yet."
      );
    else {
      setWhichSectionToShow({ verifyId: false, postReview: true });
      setFormData(prev => ({ ...prev, refCode }));
    }
  };

  const handlePost = async () => {
    const { refCode, rating, visitTypeId, monthTimeId, positiveFeedback, negativeFeedback, reviewBody } = formData;
    if (!refCode) {
      notify("error", "Please try to repeat the process.");
      return;
    }

    const { errors } = await postReview({
      variables: {
        beachBarId: id,
        paymentRefCode: refCode,
        ratingValue: rating,
        visitTypeId,
        monthTimeId,
        positiveComment: positiveFeedback,
        negativeComment: negativeFeedback,
        review: reviewBody,
      },
      refetchQueries: [{ query: BeachBarDocument, variables: { slug, userVisit: false } }],
    });
    if (errors) errors.forEach(({ message }) => notify("error", message));
    else setWhichSectionToShow({ postReview: false, verifyId: false });
  };

  useEffect(() => {
    return () => setFilterIds([]);
  }, []);

  useEffect(() => filter(), [filterIds]);
  useEffect(() => setFilteredArr(reviews), [reviews]);

  return (
    <div>
      <LayoutIconHeader
        className={styles.header}
        before={
          whichSectionToShow.verifyId || whichSectionToShow.postReview ? (
            <IconBox
              aria-label="View all #beach_bar reviews."
              onClick={() => setWhichSectionToShow({ verifyId: false, postReview: false })}
            >
              <Icons.Arrow.Left />
            </IconBox>
          ) : (
            <Link href="/beach/kikabu" prefetch={false}>
              <IconBox aria-label="Return to #beach_bar details.">
                <Icons.Arrow.Left />
              </IconBox>
            </Link>
          )
        }
        after={
          !whichSectionToShow.verifyId &&
          !whichSectionToShow.postReview && (
            <Button variant="secondary" onClick={() => setWhichSectionToShow(prev => ({ ...prev, verifyId: true }))}>
              Post review
            </Button>
          )
        }
      >
        <h5 className="beach_bar__header__name">{name}</h5>
      </LayoutIconHeader>
      {whichSectionToShow.verifyId || whichSectionToShow.postReview ? (
        <div>
          <AnimatePresence exitBeforeEnter>
            {whichSectionToShow.verifyId && (
              <motion.form
                key="verifyIdForm"
                className={styles.refCode}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: "-100%" }}
                onSubmit={handleSubmit(handleRefCodeVerification)}
              >
                <div className="text--grey">
                  Please enter the ID of your trip you made to this #beach_bar, in order to post a review
                </div>
                <Input
                  {...refCode}
                  placeholder="Trip ID"
                  maxLength={16}
                  forwardref={refCode.ref}
                  secondhelptext={{ error: true, value: errors.refCode?.message }}
                />
                <Button type="submit" variant="secondary">
                  Verify ID
                </Button>
              </motion.form>
            )}
            {whichSectionToShow.postReview && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <BeachBar.Review.ContentEdit
                  none={false}
                  onValue={state => setFormData(prev => ({ ...prev, ...state }))}
                />
                <Button className={styles.postCta} onClick={() => handlePost()}>
                  Post review
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : reviews.length > 0 ? (
        <div>
          <div className={styles.summary + " flex-row-flex-start-center"}>
            <BeachBar.Review.RatingBox className="header-5 semibold" rating={avgRating} />
            <div>
              <h5>{reviewScore?.name}</h5>
              <div>{formatNumber(reviews.length)} reviews</div>
            </div>
          </div>
          <div className={styles.filtersContainer}>
            <Search.Filters.ReviewScores
              header={""}
              greaterThan={false}
              arr={ratingValues}
              btn={{ onClick: ({ id, isChecked }) => handleClick(id, isChecked) }}
            />
            <div className="flex-row-flex-start-center">
              <Select onSelect={items => handleSelect(items)}>
                <Select.Button>Visit type</Select.Button>
                <Select.Modal>
                  <Select.Options>
                    {visitTypes.map(({ id, name }, i) => (
                      <Select.Item key={i} id={id.toString()} content={name} />
                    ))}
                  </Select.Options>
                </Select.Modal>
              </Select>
              <Select onSelect={items => handleSelect(items)}>
                <Select.Button style={{ width: 148 }}>Visit month</Select.Button>
                <Select.Modal>
                  <Select.Options>
                    {months.map((val, i) => (
                      <Select.Item key={i} id={val + "_" + i} content={val} />
                    ))}
                  </Select.Options>
                </Select.Modal>
              </Select>
            </div>
          </div>
          <div className={styles.list}>
            {sortedReviews.map(({ id, ...review }) => (
              <BeachBar.Review key={id} v2 expandedContent beachBar={{ name }} id={id} {...review} />
            ))}
          </div>
        </div>
      ) : (
        <NextDoNotHave msg="This #beach_bar, does not seem to have any reviews yet." />
      )}
    </div>
  );
};

MainPage.displayName = "BeachBarReviewMainPage";
