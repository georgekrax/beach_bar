import BeachBar from "@/components/BeachBar";
import Next from "@/components/Next";
import { useUpdateReviewMutation } from "@/graphql/generated";
import { useDashboard } from "@/utils/hooks";
import { notify } from "@/utils/notify";
import { Input } from "@hashtag-design-system/components";
import styles from "./Reviews.module.scss";

type Props = {};

export const Reviews: React.FC<Props> = () => {
  const { beachBar, loading } = useDashboard({ fetch: true });
  const reviewsArr = beachBar?.reviews || [];

  const [updateReview] = useUpdateReviewMutation();

  const handleUpdate = async (e: React.FocusEvent<HTMLTextAreaElement>, reviewId: string) => {
    const newAnswer = e.target.value;
    const review = reviewsArr.find(review => review.id === reviewId);
    if (review && (review.answer || "") === newAnswer) return;
    const { data, errors } = await updateReview({
      variables: {
        reviewId,
        answer: newAnswer,
        body: undefined,
        monthId: undefined,
        negativeComment: undefined,
        positiveComment: undefined,
        ratingValue: undefined,
        visitTypeId: undefined,
      },
    });
    if (!data && errors) return errors.forEach(({ message }) => notify("error", message));
  };

  return (
    <Next.Loading isScreen isLoading={loading}>
      {reviewsArr.length === 0 ? (
        <Next.DoNotHave emoji="😶" msg="Customers have not added any reviews for your #beach_bar." />
      ) : beachBar ? (
        <>
          <div className={styles.header + " flex-row-space-between-center"}>
            <h4>Reviews</h4>
            <BeachBar.Review.RatingBox atBeach rating={beachBar.avgRating} />
          </div>
          <div className={styles.container + " flex-row-flex-start-stretch flex--wrap"}>
            {reviewsArr.map(({ id, answer, ...review }) => (
              <BeachBar.Review
                key={"review_" + id}
                id={id}
                atBeach
                atDashboard
                hasExpandedContent
                allowVoting={false}
                beachBar={beachBar}
                container={{ className: styles.review }}
                {...review}
              >
                <Input.Multiline
                  rows={2}
                  placeholder="Your answer"
                  defaultValue={answer}
                  onBlur={async e => await handleUpdate(e, id)}
                />
              </BeachBar.Review>
            ))}
          </div>
        </>
      ) : null}
    </Next.Loading>
  );
};

Reviews.displayName = "DashboardReviews";
