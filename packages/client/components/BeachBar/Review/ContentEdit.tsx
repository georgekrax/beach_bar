import Account from "@/components/Account";
import { BeachBar, BeachBarDocument, ReviewQuery, useAddReviewMutation } from "@/graphql/generated";
import { notify } from "@/utils/notify";
import { TABLES } from "@beach_bar/common";
import { Button, Flex, Form, Input, Select, SelectItem } from "@hashtag-design-system/components";
import Icon from "@hashtag-design-system/icons";
import { MONTHS } from "@the_hashtag/common";
import range from "lodash/range";
import { useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Feedback } from "./Feedback";

export type ReviewFormData = {
  visitTypeId?: string;
  monthId?: string;
  rating: number;
  positiveFeedback?: string;
  negativeFeedback?: string;
  reviewBody?: string;
};

type Props = Partial<
  Pick<ReviewQuery["review"], "ratingValue" | "visitType" | "month" | "positiveComment" | "negativeComment" | "body">
> & {
  beachBar: Pick<BeachBar, "id" | "slug">;
  hasNone?: boolean;
  refCode: string;
  onSubmit?: (data: ReviewFormData) => void;
};

export const ContentEdit: React.FC<Props> = ({
  ratingValue,
  visitType,
  month,
  positiveComment,
  negativeComment,
  body,
  refCode,
  beachBar,
  hasNone = true,
  children,
  onSubmit,
}) => {
  const { register, watch, getValues, setValue, handleSubmit } = useForm<ReviewFormData>({
    defaultValues: {
      monthId: month?.id,
      visitTypeId: visitType?.id,
      positiveFeedback: positiveComment,
      negativeFeedback: negativeComment,
      rating: ratingValue || 3,
      reviewBody: body,
    },
  });

  const [postReview] = useAddReviewMutation();

  const { VISIT_TYPES_ARR, MONTHS_ARR } = useMemo(() => {
    return {
      VISIT_TYPES_ARR: [...(hasNone ? ["None" as any] : []), ...TABLES.REVIEW_VISIT_TYPE.map(({ name }) => name)],
      MONTHS_ARR: [...(hasNone ? ["None" as any] : []), ...MONTHS],
    };
  }, [hasNone]);

  const genKey = (val: string, idx: number) => idx + "_" + val.toLowerCase().replace(" ", "_");

  const handleSelect = (items: SelectItem[], name: Extract<keyof ReviewFormData, "monthId" | "visitTypeId">) => {
    const selected = items.find(({ isSelected }) => isSelected);
    if (!selected) return;
    const id = selected.id.split("_");
    const newVal = !hasNone ? (+id[0] + 1).toString() : id.includes("none") || id[0] === "0" ? id[1] : id[0];
    setValue(name, newVal);
  };

  const handlePost: SubmitHandler<ReviewFormData> = async _data => {
    const { rating, positiveFeedback, negativeFeedback, reviewBody, ...data } = _data;
    if (!refCode) return notify("error", "Please try to repeat the process.");

    const { errors } = await postReview({
      variables: {
        ...data,
        beachBarId: beachBar.id,
        paymentRefCode: refCode,
        ratingValue: rating,
        positiveComment: positiveFeedback,
        negativeComment: negativeFeedback,
        body: reviewBody,
      },
      refetchQueries: [{ query: BeachBarDocument, variables: { slug: beachBar.slug, userVisit: false } }],
    });
    if (errors) errors.forEach(({ message }) => notify("error", message));
    else onSubmit?.(_data);
  };

  return (
    <form onSubmit={handleSubmit(handlePost)}>
      <Account.Trips.Details
        header="Visit information"
        mt={0}
        sx={{ button: { minWidth: "10rem" }, "& > div": { _first: { alignItems: "center" } } }}
      >
        <button onClick={() => console.log(getValues())}>Click me</button>
        <Account.Trips.Info info="Visit type">
          <Select onSelect={items => handleSelect(items, "visitTypeId")}>
            <Select.Btn>{visitType?.name || "Type"}</Select.Btn>
            <Select.Modal align="right">
              <Select.Options>
                {VISIT_TYPES_ARR.map((val, i) => {
                  const key = genKey(val, i);
                  return (
                    <Select.Item
                      key={key}
                      id={key}
                      // state={!hasNone ? undefined : i.toString() === formData.visitTypeId ? "focus" : undefined}
                    >
                      {val}
                    </Select.Item>
                  );
                })}
              </Select.Options>
            </Select.Modal>
          </Select>
        </Account.Trips.Info>
        <Account.Trips.Info info="Visit month">
          <Select onSelect={items => handleSelect(items, "monthId")}>
            <Select.Btn>{month?.value || "Month"}</Select.Btn>
            <Select.Modal align="right">
              <Select.Options>
                {MONTHS_ARR.map((month, i) => {
                  const key = genKey(month, i);
                  return (
                    <Select.Item
                      key={key}
                      id={key}
                      // state={!hasNone ? undefined : i.toString() === formData.monthId ? "focus" : undefined}
                    >
                      {month}
                    </Select.Item>
                  );
                })}
              </Select.Options>
            </Select.Modal>
          </Select>
        </Account.Trips.Info>
      </Account.Trips.Details>
      <Account.Trips.Details header="Feedback">
        <Flex justify="center" align="center" gap={2} mt={4} mb={10} color="yellow.400">
          {range(1, 6).map(num => {
            const isColored = num <= watch("rating");
            return (
              <Icon.Star
                key={num}
                as={isColored ? Icon.Star.Filled : undefined}
                boxSize={12}
                cursor="pointer"
                onClick={() => setValue("rating", num)}
              />
            );
          })}
        </Flex>
        <Feedback mb={8} isShown positive>
          <Form.Control>
            <Form.Label>What did you like?</Form.Label>
            <Input.Group>
              <Input.TextArea
                hasClearBtn
                rows={4}
                placeholder="e.g. the location, the sea"
                hasFloatingPlaceholder={false}
                {...register("positiveFeedback")}
              />
            </Input.Group>
          </Form.Control>
        </Feedback>
        <Feedback isShown>
          {/* TODO: Change to <Textarea /> */}
          <Form.Control>
            <Form.Label>What could be better?</Form.Label>
            <Input.Group>
              <Input.TextArea hasClearBtn rows={4} hasFloatingPlaceholder={false} {...register("negativeFeedback")} />
            </Input.Group>
          </Form.Control>
        </Feedback>
      </Account.Trips.Details>
      <Account.Trips.Details header="Review body">
        <Form.Control>
          <Form.Label>How was your overall experience?</Form.Label>
          <Input.Group>
            <Input.TextArea rows={6} hasFloatingPlaceholder={false} {...register("reviewBody")} />
          </Input.Group>
        </Form.Control>
      </Account.Trips.Details>
      <Button type="submit" my={12} ml="auto" colorScheme="orange">
        Post review
      </Button>
      {children}
    </form>
  );
};

ContentEdit.displayName = "BeachBarReviewContentEdit";
