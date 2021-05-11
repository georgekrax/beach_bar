import Account from "@/components/Account";
import BeachBar from "@/components/BeachBar";
import Icons from "@/components/Icons";
import { DATA } from "@/config/data";
import { ReviewQuery } from "@/graphql/generated";
import { Input, Select } from "@hashtag-design-system/components";
import { SelectedItems } from "@hashtag-design-system/components";
import { MONTHS } from "@the_hashtag/common";
import range from "lodash/range";
import { useEffect, useState } from "react";
import styles from "./ContentEdit.module.scss";

export type ReviewFormData = {
  visitTypeId?: string;
  monthTimeId?: string;
  rating: number;
  positiveFeedback?: string;
  negativeFeedback?: string;
  reviewBody?: string;
};

type Props = {
  none?: boolean;
  onValue?: (state: ReviewFormData) => void;
};

export const ContentEdit: React.FC<
  Props &
    Partial<
      Pick<
        ReviewQuery["review"],
        "ratingValue" | "visitType" | "month" | "positiveComment" | "negativeComment" | "review"
      >
    >
> = ({ ratingValue, visitType, month, positiveComment, negativeComment, review, none = true, onValue }) => {
  const [formData, setFormData] = useState<ReviewFormData>({
    monthTimeId: month?.id,
    visitTypeId: visitType?.id,
    positiveFeedback: positiveComment,
    negativeFeedback: negativeComment,
    rating: ratingValue || 3,
    reviewBody: review,
  });

  const visitTypesArr = Object.values(DATA.REVIEW_VISIT_TYPES)
    .map(({ name }) => name)
    .concat(none ? "None" : [])
    .flat();
  const monthsArr = MONTHS.concat(none ? "None" : []).flat();

  const genKey = (val: string, idx: number) => idx + "_" + val.toLowerCase().replace(" ", "_");
  const handleStarClick = (newRating: number) => setFormData(prev => ({ ...prev, rating: newRating }));

  const handleSelect = (items: SelectedItems[], name: Extract<keyof ReviewFormData, "monthTimeId" | "visitTypeId">) => {
    const selected = items.find(({ selected }) => selected);
    if (!selected) return;
    const id = selected.id.split("_");
    console.log(id);
    setFormData(prev => ({
      ...prev,
      [name]: !none ? (parseInt(id[0]) + 1).toString() : id.includes("none") || id[0] === "0" ? id[1] : id[0],
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  useEffect(() => {
    if (onValue) onValue(formData);
  }, [formData]);

  return (
    <>
      <Account.Trips.Details className={styles.visit} header="Visit information">
        <Account.Trips.Info info="Visit type">
          <Select onSelect={items => handleSelect(items, "visitTypeId")}>
            <Select.Button>{visitType?.name || "Type"}</Select.Button>
            <Select.Modal>
              <Select.Options>
                {visitTypesArr.map((val, i) => {
                  const key = genKey(val, i);
                  return (
                    <Select.Item
                      key={key}
                      id={key}
                      content={val}
                      state={!none ? undefined : i.toString() === formData.visitTypeId ? "focus" : undefined}
                    />
                  );
                })}
              </Select.Options>
            </Select.Modal>
          </Select>
        </Account.Trips.Info>
        <Account.Trips.Info info="Visit month">
          <Select onSelect={items => handleSelect(items, "monthTimeId")}>
            <Select.Button>{month?.value || "Month"}</Select.Button>
            <Select.Modal>
              <Select.Options>
                {monthsArr.map((month, i) => {
                  const key = genKey(month, i);
                  return (
                    <Select.Item
                      key={key}
                      id={key}
                      content={month}
                      state={!none ? undefined : i.toString() === formData.monthTimeId ? "focus" : undefined}
                    />
                  );
                })}
              </Select.Options>
            </Select.Modal>
          </Select>
        </Account.Trips.Info>
      </Account.Trips.Details>
      <Account.Trips.Details header="Feedback">
        <div className={styles.ratingContainer + " flex-row-center-center"}>
          {range(1, 6).map(num =>
            num <= formData.rating ? (
              <Icons.Star.Colored
                key={num}
                width={48}
                height={48}
                className={styles.rating + " " + styles.colored}
                onClick={() => handleStarClick(num)}
              />
            ) : (
              <Icons.Star
                key={num}
                width={48}
                height={48}
                className={styles.rating}
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
            defaultValue={positiveComment}
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
            defaultValue={negativeComment}
            onChange={e => handleChange(e)}
          />
        </BeachBar.Review.Feedback>
      </Account.Trips.Details>
      <Account.Trips.Details header="Review body">
        <Input.Multiline
          rows={6}
          name="reviewBody"
          label="How was your overall experience?"
          defaultValue={review}
          floatingplaceholder={false}
          onChange={e => handleChange(e)}
        />
      </Account.Trips.Details>
    </>
  );
};

ContentEdit.displayName = "BeachBarReviewContentEdit";
