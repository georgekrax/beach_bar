<<<<<<< HEAD
import Account from "@/components/Account";
import Icons from "@/components/Icons";
import {
  BeachBarDocument,
  BeachBarQuery,
  BeachBarReview,
  ReviewDocument,
  ReviewQuery,
  useUpdateReviewVoteMutation,
} from "@/graphql/generated";
import { useAuth } from "@/utils/hooks";
import { notify } from "@/utils/notify";
import { Button } from "@hashtag-design-system/components";
import dayjs from "dayjs";
import Link from "next/link";
import { useMemo } from "react";
import BeachBar from "../BeachBar";
import { ContentEdit } from "./ContentEdit";
import { Feedback } from "./Feedback";
import { MainPage } from "./MainPage";
import { RatingBox } from "./RatingBox";
import styles from "./Review.module.scss";

type SubComponents = {
  Feedback: typeof Feedback;
  RatingBox: typeof RatingBox;
  MainPage: typeof MainPage;
  ContentEdit: typeof ContentEdit;
};

type Props = {
  beachBar: Pick<BeachBarReview["beachBar"], "name">;
  expandedContent?: boolean;
  v2?: boolean;
};

type FProps = Props &
  Omit<ReviewQuery["review"], "__typename" | "beachBar"> &
  Partial<Pick<NonNullable<BeachBarQuery["beachBar"]>["reviews"][number], "payment">>;

export const Review: React.FC<FProps> & SubComponents = ({
  id,
  ratingValue,
  positiveComment,
  negativeComment,
  review,
  votes,
  beachBar,
  month,
  visitType,
  payment,
  timestamp,
  expandedContent = false,
  v2 = false,
  customer,
}) => {
  const { data, refetch } = useAuth();
  const [updateVote] = useUpdateReviewVoteMutation();

  const handleClick = async (action: "upvote" | "downvote") => {
    const { errors } = await updateVote({
      variables: { reviewId: id, upvote: action === "upvote", downvote: action === "downvote" },
      refetchQueries: [{ query: BeachBarDocument, variables: { slug: "kikabu" } }],
      update: async (cache, { data }) => {
        const cachedData = cache.readQuery<ReviewQuery>({ query: ReviewDocument, variables: { reviewId: id } });
        if (!data) return;
        cache.writeQuery({
          query: ReviewDocument,
          variables: { reviewId: id },
          data: { review: { ...cachedData?.review, ...data.updateReviewVote.review } },
        });
        await refetch();
      },
    });
    if (errors) errors.forEach(({ message }) => notify("error", message));
  };

  const content = useMemo(() => {
    let content: Pick<FProps, "negativeComment" | "positiveComment" | "review"> = expandedContent
      ? {
          positiveComment,
          negativeComment,
          review,
        }
      : {
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
  const userVote = useMemo(() => data?.me?.reviewVotes?.find(({ review }) => review.id === id), [data]);
  // const downVotes = useMemo(() => votes.filter(({ type: { value } }) => value === "downvote"), [votes]);
  const upVotes = useMemo(() => votes.filter(({ type: { value } }) => value === "upvote") || [], [votes]);
  const formattedTimestamp = useMemo(() => dayjs(timestamp).format("MM/DD/YYYY"), [timestamp]);

  return (
    <div className={styles.container + " w100 flex-column-center-flex-start"}>
      <div className="w100 flex-row-space-between-center">
        {v2 ? (
          customer.user && (
            <div className={styles.avatar + " flex-row-center-flex-start"}>
              <Account.Avatar src={customer.user.account.imgUrl} width={48} height={48} />
              <div className="flex-column-column-flex-start">
                <div className="semibold"> {customer.user.fullName}</div>
                <div className={styles.userSubheader + " body-14 flex-row-flex-start-center"}>
                  <div>{visitType?.name}</div>
                  {visitType && month && <div className="bull">&bull;</div>}
                  <div>
                    {month?.value} {payment ? dayjs(payment?.timestamp).year() : formattedTimestamp}
                  </div>
                </div>
              </div>
            </div>
          )
        ) : (
          <BeachBar.Header as="h6">{beachBar.name}</BeachBar.Header>
        )}
        <RatingBox rating={ratingValue} />
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
      <div className={styles.votesAndDetails + " w100 flex-row-flex-end-flex-end"}>
        <div className="flex-row-flex-start-center text--grey">
          <div
            className={(userVote?.type.value === "upvote" ? styles.selected : "") + " flex-row-center-center"}
            onClick={async () => await handleClick("upvote")}
          >
            <Icons.Thumb.Up.Filled />
            <span className="semibold">{upVotes.length}</span>
          </div>
          <div
            className={(userVote?.type.value === "downvote" ? styles.selected : "") + " flex-row-center-center"}
            onClick={async () => await handleClick("downvote")}
          >
            <Icons.Thumb.Down.Filled />
            {/* <span className="semibold">{downVotes.length}</span> */}
          </div>
        </div>
        {v2 ? (
          <small className="body-14 text--grey">{formattedTimestamp}</small>
        ) : (
          <Link href={{ pathname: `reviews/${id}` }}>
            <Button variant="secondary">Details</Button>
          </Link>
        )}
      </div>
    </div>
  );
};

Review.Feedback = Feedback;
Review.RatingBox = RatingBox;
Review.MainPage = MainPage;
Review.ContentEdit = ContentEdit;

Review.displayName = "BeachBarReview";
=======
import Account from "@/components/Account";
import Icons from "@/components/Icons";
import {
  BeachBarDocument,
  BeachBarQuery,
  BeachBarReview,
  ReviewDocument,
  ReviewQuery,
  useUpdateReviewVoteMutation,
} from "@/graphql/generated";
import { useAuth } from "@/utils/hooks";
import { notify } from "@/utils/notify";
import { Button } from "@hashtag-design-system/components";
import dayjs from "dayjs";
import Link from "next/link";
import { useMemo } from "react";
import BeachBar from "../BeachBar";
import { ContentEdit } from "./ContentEdit";
import { Feedback } from "./Feedback";
import { MainPage } from "./MainPage";
import { RatingBox } from "./RatingBox";
import styles from "./Review.module.scss";

type SubComponents = {
  Feedback: typeof Feedback;
  RatingBox: typeof RatingBox;
  MainPage: typeof MainPage;
  ContentEdit: typeof ContentEdit;
};

type Props = {
  beachBar: Pick<BeachBarReview["beachBar"], "name">;
  expandedContent?: boolean;
  v2?: boolean;
};

type FProps = Props &
  Omit<ReviewQuery["review"], "__typename" | "beachBar"> &
  Partial<Pick<NonNullable<BeachBarQuery["beachBar"]>["reviews"][number], "payment">>;

export const Review: React.FC<FProps> & SubComponents = ({
  id,
  ratingValue,
  positiveComment,
  negativeComment,
  review,
  votes,
  beachBar,
  month,
  visitType,
  payment,
  timestamp,
  expandedContent = false,
  v2 = false,
  customer,
}) => {
  const { data, refetch } = useAuth();
  const [updateVote] = useUpdateReviewVoteMutation();

  const handleClick = async (action: "upvote" | "downvote") => {
    const { errors } = await updateVote({
      variables: { reviewId: id, upvote: action === "upvote", downvote: action === "downvote" },
      refetchQueries: [{ query: BeachBarDocument, variables: { slug: "kikabu" } }],
      update: async (cache, { data }) => {
        const cachedData = cache.readQuery<ReviewQuery>({ query: ReviewDocument, variables: { reviewId: id } });
        if (!data) return;
        cache.writeQuery({
          query: ReviewDocument,
          variables: { reviewId: id },
          data: { review: { ...cachedData?.review, ...data.updateReviewVote.review } },
        });
        await refetch();
      },
    });
    if (errors) errors.forEach(({ message }) => notify("error", message));
  };

  const content = useMemo(() => {
    let content: Pick<FProps, "negativeComment" | "positiveComment" | "review"> = expandedContent
      ? {
          positiveComment,
          negativeComment,
          review,
        }
      : {
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
  const userVote = useMemo(() => data?.me?.reviewVotes?.find(({ review }) => review.id === id), [data]);
  // const downVotes = useMemo(() => votes.filter(({ type: { value } }) => value === "downvote"), [votes]);
  const upVotes = useMemo(() => votes.filter(({ type: { value } }) => value === "upvote") || [], [votes]);
  const formattedTimestamp = useMemo(() => dayjs(timestamp).format("MM/DD/YYYY"), [timestamp]);

  return (
    <div className={styles.container + " w100 flex-column-center-flex-start"}>
      <div className="w100 flex-row-space-between-center">
        {v2 ? (
          customer.user && (
            <div className={styles.avatar + " flex-row-center-flex-start"}>
              <Account.Avatar src={customer.user.account.imgUrl} width={48} height={48} />
              <div className="flex-column-column-flex-start">
                <div className="semibold"> {customer.user.fullName}</div>
                <div className={styles.userSubheader + " body-14 flex-row-flex-start-center"}>
                  <div>{visitType?.name}</div>
                  {visitType && month && <div className="bull">&bull;</div>}
                  <div>
                    {month?.value} {payment ? dayjs(payment?.timestamp).year() : formattedTimestamp}
                  </div>
                </div>
              </div>
            </div>
          )
        ) : (
          <BeachBar.Header as="h6">{beachBar.name}</BeachBar.Header>
        )}
        <RatingBox rating={ratingValue} />
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
      <div className={styles.votesAndDetails + " w100 flex-row-flex-end-flex-end"}>
        <div className="flex-row-flex-start-center text--grey">
          <div
            className={(userVote?.type.value === "upvote" ? styles.selected : "") + " flex-row-center-center"}
            onClick={async () => await handleClick("upvote")}
          >
            <Icons.Thumb.Up.Filled />
            <span className="semibold">{upVotes.length}</span>
          </div>
          <div
            className={(userVote?.type.value === "downvote" ? styles.selected : "") + " flex-row-center-center"}
            onClick={async () => await handleClick("downvote")}
          >
            <Icons.Thumb.Down.Filled />
            {/* <span className="semibold">{downVotes.length}</span> */}
          </div>
        </div>
        {v2 ? (
          <small className="body-14 text--grey">{formattedTimestamp}</small>
        ) : (
          <Link href={{ pathname: `reviews/${id}` }}>
            <Button variant="secondary">Details</Button>
          </Link>
        )}
      </div>
    </div>
  );
};

Review.Feedback = Feedback;
Review.RatingBox = RatingBox;
Review.MainPage = MainPage;
Review.ContentEdit = ContentEdit;

Review.displayName = "BeachBarReview";
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
