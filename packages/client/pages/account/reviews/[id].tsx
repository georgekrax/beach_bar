import Account from "@/components/Account";
import BeachBar from "@/components/BeachBar";
import Header from "@/components/Header";
import Icons from "@/components/Icons";
import Next from "@/components/Next";
import { ReviewsDocument, useDeleteReviewMutation, useReviewQuery, useUpdateReviewMutation } from "@/graphql/generated";
import { useHookForm } from "@/utils/hooks";
import { notify } from "@/utils/notify";
import { TABLES } from "@beach_bar/common";
import { Dialog, DialogDismissInfoType, Input, Select, SelectedItems } from "@hashtag-design-system/components";
import { MONTHS } from "@the_hashtag/common";
import dayjs from "dayjs";
import range from "lodash/range";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";

type FormData = {
  visitTypeId: string | undefined;
  monthId: string | undefined;
  positiveComment: string | undefined;
  negativeComment: string | undefined;
  body: string | undefined;
};

const AccountReviewInfoPage: React.FC = () => {
  const router = useRouter();
  const [ratingValue, setRatingValue] = useState(0);
  const [isDialogShown, setIsDialogShown] = useState(false);

  const variables = { reviewId: router.query.id as string };
  const { data, loading, error } = useReviewQuery({ variables });
  const [deleteReview] = useDeleteReviewMutation();
  const [updateReview] = useUpdateReviewMutation();

  const { handleSubmit, ...form } = useForm<FormData>();
  const { handleChange } = useHookForm<FormData>({
    ...form,
    data: !data
      ? undefined
      : {
          ...data?.review,
          monthId: data?.review.month?.id,
          visitTypeId: data?.review.visitType?.id,
        },
  });

  const genKey = (val: string, idx: number) => idx + "_" + val.toLowerCase().replace(" ", "_");
  const handleStarClick = (newRating: number) => setRatingValue(newRating);

  const handleDismiss = async ({ cancel }: DialogDismissInfoType) => {
    if (!cancel) {
      const { errors } = await deleteReview({ variables, refetchQueries: [{ query: ReviewsDocument }] });
      if (errors) errors.forEach(({ message }) => notify("error", message));
      else {
        notify("success", "Success! Your review is deleted");
        setTimeout(() => router.push("/account/reviews"), 1500);
      }
    }
    setIsDialogShown(false);
  };

  const handleSelect = (items: SelectedItems[], name: Extract<keyof FormData, "monthId" | "visitTypeId">) => {
    const selected = items.find(({ selected }) => selected);
    if (!selected) return;
    const id = selected.id.split("_");
    handleChange(name, id.includes("none") || id[0] === "0" ? id[1] : id[0]);
  };

  const onSubmit = async (rest: FormData) => {
    const { errors } = await updateReview({ variables: { ...variables, ...rest, ratingValue } });
    if (errors) errors.forEach(({ message }) => notify("error", message));
    else notify("success", "Success! Your changes were saved.");
  };

  useEffect(() => {
    if (data?.review) setRatingValue(data.review.ratingValue);
  }, [data]);

  return (
    // <Layout header={false} tapbar={false} footer={false} container={{ style: { padding: 0 } }}>
    <Header.Crud
      fullPage
      title="Review"
      closeIcon="chevron_left"
      cta={{ children: "Save", onClick: handleSubmit(onSubmit) }}
      onClose={() => router.back()}
    >
      {loading ? (
        <h2>Loading...</h2>
      ) : error || !data?.review ? (
        <h2>Error</h2>
      ) : (
        <Next.MotionContainer>
          <Toaster position="top-center" />
          <div className="account__reviews-info flex-row-flex-start-flex-start flex--wrap">
            <div>
              <Account.Trips.Details className="im0">
                <Account.Trips.Info info="#beach_bar">
                  <Account.Trips.DoubleInfo
                    primary={data.review.beachBar.name}
                    secondary={data.review.beachBar.location?.formattedLocation}
                  />
                </Account.Trips.Info>
                <Account.Trips.Info info="Payment ID" children="njbHf235RW3ubpTK" />
                <Account.Trips.Info info="Posted at" children={dayjs(data.review.timestamp).format("MM/DD/YYYY")} />
              </Account.Trips.Details>
              <Account.Trips.Details header="Visit information" style={{ position: "relative" }}>
                <Account.Trips.Info info="Visit type">
                  <Select onSelect={items => handleSelect(items, "visitTypeId")}>
                    <Select.Btn>{data.review.visitType?.name || "Type"}</Select.B>
                    <Select.Modal fullWidth>
                      <Select.Options>
                        {["None", ...TABLES.REVIEW_VISIT_TYPE.map(({ name }) => name)].map((val, i) => {
                          const key = genKey(val, i);
                          return (
                            <Select.Item
                              key={key}
                              id={key}
                              state={i.toString() === data.review.visitType?.id ? "focus" : undefined}
                            >{val}</Select.Item>
                          );
                        })}
                      </Select.Options>
                    </Select.Modal>
                  </Select>
                </Account.Trips.Info>
                <Account.Trips.Info info="Visit month">
                  <Select onSelect={items => handleSelect(items, "monthId")}>
                    <Select.Button>{data.review.month?.value || "Month"}</Select.Button>
                    <Select.Modal fullWidth>
                      <Select.Options>
                        {["None", ...MONTHS].map((month, i) => {
                          const key = genKey(month, i);
                          return (
                            <Select.Item
                              key={key}
                              id={key}
                              // state={i.toString() === data.review.month?.id ? "focus" : undefined}
                            >{month}</Select.Item>
                          );
                        })}
                      </Select.Options>
                    </Select.Modal>
                  </Select>
                </Account.Trips.Info>
              </Account.Trips.Details>
            </div>
            <Account.Trips.Details className="im0" header="Feedback">
              <div className="flex-row-center-center">
                {range(1, 6).map(num =>
                  num <= ratingValue ? (
                    <Icons.Star.Colored
                      key={num}
                      width={48}
                      height={48}
                      className="cursor--pointer"
                      onClick={() => handleStarClick(num)}
                    />
                  ) : (
                    <Icons.Star
                      key={num}
                      width={48}
                      height={48}
                      className="cursor--pointer"
                      onClick={() => handleStarClick(num)}
                    />
                  )
                )}
              </div>
              <BeachBar.Review.Feedback className="account__reviews-info__feedback" isShown positive>
                <Input.Multiline
                  rows={4}
                  name="positiveFeedback"
                  label="What did you like?"
                  defaultValue={data.review.positiveComment}
                  placeholder="e.g. the location, the sea"
                  floatingplaceholder={false}
                  onChange={e => handleChange("positiveComment", e.target.value)}
                />
              </BeachBar.Review.Feedback>
              <BeachBar.Review.Feedback className="account__reviews-info__feedback" isShown>
                <Input.Multiline
                  rows={4}
                  name="negativeFeedback"
                  label="What could be better?"
                  placeholder=""
                  defaultValue={data.review.negativeComment}
                  onChange={e => handleChange("negativeComment", e.target.value)}
                />
              </BeachBar.Review.Feedback>
            </Account.Trips.Details>
            <Account.Trips.Details className="im0" header="Review body">
              <Input.Multiline
                rows={6}
                name="body"
                label="How was your overall experience?"
                defaultValue={data.review.body}
                floatingplaceholder={false}
                onChange={e => handleChange("body", e.target.value)}
              />
            </Account.Trips.Details>
            <div>
              <Account.Trips.Details className="im0 account__reviews-info__answer" header="#beach_bar's Answer">
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
          </div>
        </Next.MotionContainer>
      )}
      <Dialog isShown={isDialogShown} onDismiss={async (_, info) => await handleDismiss(info)}>
        <Dialog.Content className="text--center">
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
    // </Layout>
  );
};

AccountReviewInfoPage.displayName = "AccountReviewInfoPage";

export default AccountReviewInfoPage;
