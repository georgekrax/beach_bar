import Account from "@/components/Account";
import BeachBar from "@/components/BeachBar";
import Header from "@/components/Header";
import Icons from "@/components/Icons";
import Layout from "@/components/Layout";
import { DATA } from "@/config/data";
import {
  ReviewDocument,
  useDeleteReviewMutation,
  useReviewQuery,
  UserReviewsDocument,
  useUpdateReviewMutation,
} from "@/graphql/generated";
import { initializeApollo, INITIAL_APOLLO_STATE } from "@/lib/apollo";
import { notify } from "@/utils/notify";
import { Dialog, Input, Select } from "@hashtag-design-system/components";
import { SelectedItems } from "@hashtag-design-system/components";
import { MONTHS } from "@the_hashtag/common";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import range from "lodash/range";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

type FormData = {
  visitTypeId?: string;
  monthTimeId?: string;
  rating: number;
  positiveFeedback?: string;
  negativeFeedback?: string;
  reviewBody?: string;
};

const Review: React.FC = () => {
  const router = useRouter();
  const variables = { reviewId: router.query.id as string };
  const { data, loading, error } = useReviewQuery({ variables });

  const [deleteReview] = useDeleteReviewMutation();
  const [updateReview] = useUpdateReviewMutation();

  const [isDialogShown, setIsDialogShown] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    monthTimeId: data?.review.month?.id,
    visitTypeId: data?.review.visitType?.id,
    positiveFeedback: data?.review.positiveComment,
    negativeFeedback: data?.review.negativeComment,
    rating: data?.review.ratingValue || 0,
    reviewBody: data?.review.review,
  });

  const genKey = (val: string, idx: number) => idx + "_" + val.toLowerCase().replace(" ", "_");
  const handleStarClick = (newRating: number) => setFormData(prev => ({ ...prev, rating: newRating }));

  const handleSelect = (items: SelectedItems[], name: Extract<keyof FormData, "monthTimeId" | "visitTypeId">) => {
    const selected = items.find(({ selected }) => selected);
    if (!selected) return;
    const id = selected.id.split("_");
    setFormData(prev => ({ ...prev, [name]: id.includes("none") || id[0] === "0" ? id[1] : id[0] }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  const handleSubmit = async () => {
    const review = data?.review;
    if (!review) return;
    const { rating, visitTypeId, monthTimeId, positiveFeedback, negativeFeedback, reviewBody } = formData;
    const { errors } = await updateReview({
      variables: {
        ...variables,
        ratingValue: rating,
        visitTypeId,
        monthTimeId,
        positiveComment: positiveFeedback,
        negativeComment: negativeFeedback,
        review: reviewBody,
      },
      optimisticResponse: {
        __typename: "Mutation",
        updateReview: {
          __typename: "UpdateBeachBarReview",
          updated: true,
          review: {
            ...review,
            id: variables.reviewId,
            ratingValue: rating,
            visitType: (visitTypeId === "none" || !review.visitType
              ? undefined
              : { __typename: "ReviewVisitType", id: visitTypeId, name: review.visitType.name }) as any,
            month:
              monthTimeId === "none" || !review.month || !monthTimeId
                ? undefined
                : { __typename: "MonthTime", id: monthTimeId, value: MONTHS[parseInt(monthTimeId) - 1] },
            positiveComment: positiveFeedback,
            negativeComment: negativeFeedback,
            review: reviewBody,
          },
        },
      },
    });
    if (errors) errors.forEach(({ message }) => notify("error", message));
    else notify("success", "Success! Your review changes are saved");
  };

  return (
    <Layout header={false} tapbar={false} footer={false} container={{ style: { padding: 0 } }}>
      <Toaster position="top-center" />
      <Header.Crud
        title="Review"
        closeIcon="chevron_left"
        content={{ className: "account-trips__details__container" }}
        onClose={() => router.push({ pathname: "/account/reviews" })}
        cta={{ children: "Save", onClick: async () => handleSubmit() }}
      >
        {loading ? (
          <h2>Loading...</h2>
        ) : error || !data || !data.review ? (
          <h2>Error</h2>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit="initial">
            <div className="account-reviews__details__container flex-column-flex-start-center">
              <Account.Trips.Details>
                <Account.Trips.Info info="#beach_bar">
                  <Account.Trips.DoubleInfo
                    primary={data.review.beachBar.name}
                    secondary={data.review.beachBar.formattedLocation}
                  />
                </Account.Trips.Info>
                <Account.Trips.Info info="Payment ID" children="njbHf235RW3ubpTK" />
                <Account.Trips.Info info="Posted at" children={dayjs(data.review.timestamp).format("MM/DD/YYYY")} />
              </Account.Trips.Details>
              <Account.Trips.Details className="account-reviews__visit" header="Visit information">
                <Account.Trips.Info info="Visit type">
                  <Select onSelect={items => handleSelect(items, "visitTypeId")}>
                    <Select.Button>{data.review.visitType?.name || "Type"}</Select.Button>
                    <Select.Modal>
                      <Select.Options>
                        {["None", ...Object.values(DATA.REVIEW_VISIT_TYPES).map(({ name }) => name)].map((val, i) => {
                          const key = genKey(val, i);
                          return (
                            <Select.Item
                              key={key}
                              id={key}
                              content={val}
                              state={i.toString() === formData.visitTypeId ? "focus" : undefined}
                            />
                          );
                        })}
                      </Select.Options>
                    </Select.Modal>
                  </Select>
                </Account.Trips.Info>
                <Account.Trips.Info info="Visit month">
                  <Select onSelect={items => handleSelect(items, "monthTimeId")}>
                    <Select.Button>{data.review.month?.value || "Month"}</Select.Button>
                    <Select.Modal>
                      <Select.Options>
                        {["None", ...MONTHS].map((month, i) => {
                          const key = genKey(month, i);
                          return (
                            <Select.Item
                              key={key}
                              id={key}
                              content={month}
                              state={i.toString() === formData.monthTimeId ? "focus" : undefined}
                            />
                          );
                        })}
                      </Select.Options>
                    </Select.Modal>
                  </Select>
                </Account.Trips.Info>
              </Account.Trips.Details>
              <Account.Trips.Details header="Feedback">
                <div className="account-reviews__rating__container flex-row-center-center">
                  {range(1, 6).map(num =>
                    num <= formData.rating ? (
                      <Icons.Star.Colored
                        key={num}
                        width={48}
                        height={48}
                        className="account-reviews__rating colored"
                        onClick={() => handleStarClick(num)}
                      />
                    ) : (
                      <Icons.Star
                        key={num}
                        width={48}
                        height={48}
                        className="account-reviews__rating"
                        onClick={() => handleStarClick(num)}
                      />
                    )
                  )}
                </div>
                <BeachBar.Review.Feedback className="account-reviews__feedback" isShown positive>
                  <Input.Multiline
                    rows={4}
                    name="positiveFeedback"
                    label="What did you like?"
                    defaultValue={data.review.positiveComment}
                    placeholder="e.g. the location, the sea"
                    floatingplaceholder={false}
                    onChange={e => handleChange(e)}
                  />
                </BeachBar.Review.Feedback>
                <BeachBar.Review.Feedback className="account-reviews__feedback" isShown>
                  <Input.Multiline
                    rows={4}
                    name="negativeFeedback"
                    label="What could be better?"
                    placeholder=""
                    defaultValue={data.review.negativeComment}
                    onChange={e => handleChange(e)}
                  />
                </BeachBar.Review.Feedback>
              </Account.Trips.Details>
              <Account.Trips.Details header="Review body">
                <Input.Multiline
                  rows={6}
                  name="reviewBody"
                  label="How was your overall experience?"
                  defaultValue={data.review.review}
                  floatingplaceholder={false}
                  onChange={e => handleChange(e)}
                />
              </Account.Trips.Details>
              <Account.Trips.Details className="account-reviews__answer" header="#beach_bar's Answer">
                {data.review.answer ? (
                  <div>{data.review.answer.body}</div>
                ) : (
                  <div className="flex-column-center-center">
                    <Icons.Search.NotFound width={40} height={40} />
                    <span style={{ textAlign: "center" }}>
                      The #beach_bar you have reviewed has not yet replied to your comments.
                    </span>
                  </div>
                )}
              </Account.Trips.Details>
              <Account.Trips.Details header="Delete">
                <div className="flex-column-center-flex-start">
                  Delete your review for this #beach_bar.
                  <Header.Crud.Btn variant="danger" onClick={() => setIsDialogShown(true)}>
                    Delete
                  </Header.Crud.Btn>
                </div>
              </Account.Trips.Details>
            </div>
          </motion.div>
        )}
        <Dialog
          isShown={isDialogShown}
          onDismiss={async (_, { cancel }) => {
            if (!cancel) {
              const { errors } = await deleteReview({ variables, refetchQueries: [{ query: UserReviewsDocument }] });
              if (errors) errors.forEach(({ message }) => notify("error", message));
              else {
                notify("success", "Success! Your review is deleted");
                setTimeout(() => router.push("/account/reviews"), 1500);
              }
            }
            setIsDialogShown(false);
          }}
        >
          <Dialog.Content style={{ textAlign: "center" }}>
            <Dialog.Title>Are you sure you want to delete your review?</Dialog.Title>
          </Dialog.Content>
          <Dialog.Btn.Group>
            <Dialog.Btn>No</Dialog.Btn>
            <Dialog.Btn variant="danger" confirm>
              Yes
            </Dialog.Btn>
          </Dialog.Btn.Group>
        </Dialog>
      </Header.Crud>
    </Layout>
  );
};

Review.displayName = "AccountReview";

export default Review;

export const getServerSideProps: GetServerSideProps = async ctx => {
  const apolloClient = initializeApollo(ctx);

  await apolloClient.query({ query: ReviewDocument, variables: { reviewId: ctx.query.id } });

  return { props: { [INITIAL_APOLLO_STATE]: apolloClient.cache.extract() } };
};
