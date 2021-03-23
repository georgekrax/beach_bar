import BeachBar from "@/components/BeachBar";
import Icons from "@/components/Icons";
import {
  BeachBarReview,
  MeDocument,
  ReviewVote,
  UserReviewsDocument,
  UserReviewsQuery,
  useUpdateReviewVoteMutation,
} from "@/graphql/generated";
import { notify } from "@/utils/notify";
import { Button } from "@hashtag-design-system/components";
import Link from "next/link";
import { useMemo } from "react";
import { Feedback } from "./Feedback";
import styles from "./Review.module.scss";

type SubComponents = {
  Feedback: typeof Feedback;
};

type Props = {
  beachBar: Pick<BeachBarReview["beachBar"], "name">;
  userVote?: ReviewVote;
};

type FProps = Props &
  Pick<BeachBarReview, "id" | "ratingValue" | "positiveComment" | "negativeComment" | "review" | "votes">;

export const Review: React.FC<FProps> & SubComponents = ({
  id,
  ratingValue,
  positiveComment,
  negativeComment,
  review,
  votes,
  userVote,
  beachBar,
}) => {
  const [updateVote] = useUpdateReviewVoteMutation();

  const handleClick = async (action: "upvote" | "downvote") => {
    const { errors } = await updateVote({
      variables: { reviewId: id, upvote: action === "upvote", downvote: action === "downvote" },
      refetchQueries: [{ query: MeDocument }],
      update: (cache, { data }) => {
        const cachedData = cache.readQuery<UserReviewsQuery>({ query: UserReviewsDocument });
        if (!cachedData || !data) return;
        const newData = cachedData.userReviews.map(review => {
          if (review.id.toString() === id.toString()) return data.updateReviewVote.review;
          else return review;
        });
        cache.writeQuery({ query: UserReviewsDocument, data: { reviews: newData } });
      },
    });
    if (errors) errors.forEach(({ message }) => notify("error", message));
  };

  const content = useMemo(() => {
    let content: Pick<FProps, "negativeComment" | "positiveComment" | "review"> = {
      positiveComment: undefined,
      negativeComment: undefined,
      review: undefined,
    };
    if (positiveComment && negativeComment) content = { ...content, positiveComment, negativeComment };
    else if (positiveComment) {
      content = { ...content, positiveComment };
      if (review) content = { ...content, review };
    } else if (negativeComment) {
      content = { ...content, negativeComment };
      if (review) content = { ...content, review };
    } else if (review) content = { ...content, review };
    return content;
  }, [positiveComment, negativeComment, review]);
  const downVotes = useMemo(() => votes.filter(({ type: { value } }) => value === "downvote"), [votes]);
  const upVotes = useMemo(() => votes.filter(({ type: { value } }) => value === "upvote"), [votes]);

  return (
    <div className={styles.container + " flex-column-center-flex-start"}>
      <div className="w-100 flex-row-space-between-center">
        <BeachBar.Header as="h6">{beachBar.name}</BeachBar.Header>
        <div className={styles.ratingBox + " " + styles[`rating_${ratingValue}`] + " " + " flex-row-center-center"}>
          {ratingValue}
        </div>
      </div>
      <div className={styles.content}>
        <div className="flex-column-center-flex-start">
          <Feedback isShown={!!content.positiveComment} positive>
            <span>{content.positiveComment}</span>
          </Feedback>
          <Feedback isShown={!!content.negativeComment}>
            <span>{content.negativeComment}</span>
          </Feedback>
          {content.review && <span>{content.review}</span>}
        </div>
      </div>
      <div className={styles.votesAndDetails + " w-100 flex-row-flex-end-flex-end"}>
        <div className="flex-row-flex-start-center">
          <div
            className={(userVote?.type.value === "upvote" ? styles.selected : "") + " flex-row-center-center"}
            onClick={async () => await handleClick("upvote")}
          >
            <Icons.Thumb.Up.Filled width={28} height={28} />
            <span className="semibold">{upVotes.length}</span>
          </div>
          <div
            className={(userVote?.type.value === "downvote" ? styles.selected : "") + " flex-row-center-center"}
            onClick={async () => await handleClick("downvote")}
          >
            <Icons.Thumb.Down.Filled width={28} height={28} />
            <span className="semibold">{downVotes.length}</span>
          </div>
        </div>
        <Link href={{ pathname: `reviews/${id}` }}>
          <Button variant="secondary">Details</Button>
        </Link>
      </div>
    </div>
  );
};

Review.Feedback = Feedback;

Review.displayName = "BeachBarReview";
