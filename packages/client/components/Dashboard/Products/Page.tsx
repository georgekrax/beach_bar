import BeachBar from "@/components/BeachBar";
import Dashboard from "@/components/Dashboard";
import Header from "@/components/Header";
import Next from "@/components/Next";
import {
  Product,
  ProductQuery,
  useAddProductMutation,
  useAddProductReservationLimitMutation,
  useUpdateProductMutation,
} from "@/graphql/generated";
import { ProductLimit } from "@/typings/beachBar";
import { useDashboard, useHookForm } from "@/utils/hooks";
import { notify } from "@/utils/notify";
import { dayjsFormat, TABLES } from "@beach_bar/common";
import { Form, Input, Select } from "@hashtag-design-system/components";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./Page.module.scss";

const { PRODUCT_CATEGORY } = TABLES;

type FormData = {
  categoryId: string;
} & Pick<Product, "name" | "description" | "price" | "maxPeople" | "minFoodSpending" | "imgUrl">;

const LIMIT_BUTTON_TEXT = "Add";

export type Props = {
  productId?: string;
  atEdit?: boolean;
  defaultValues?: Partial<FormData & Pick<NonNullable<ProductQuery["product"]>, "reservationLimits">>;
  isLoading?: boolean;
  isError?: boolean;
};

export const Page: React.FC<Props> = ({
  atEdit = false,
  productId,
  defaultValues,
  isLoading = false,
  isError = false,
}) => {
  const router = useRouter();
  const [limits, setLimits] = useState<ProductLimit[]>([]);
  const { beachBarId } = useDashboard();

  const [addProduct] = useAddProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [addReservationLimits] = useAddProductReservationLimitMutation();

  const { formState, watch, handleSubmit, ...form } = useForm<FormData>();
  // @ts-expect-error
  const { handleChange, handleSelect } = useHookForm<FormData, undefined, Extract<keyof FormData, "categoryId">>({
    ...form,
    data: { price: 0, maxPeople: 1, minFoodSpending: 0, ...defaultValues },
    registerOptions: () => ({ required: true, minLength: 1 }),
    registeredFields: ["name", "categoryId", "price", "maxPeople"],
  });

  const onSubmit = async (formData: FormData) => {
    if (!beachBarId) return notify("error", "");
    if (atEdit) {
      if (!productId) return notify("error", "");
      const { data: updateData, errors } = await updateProduct({ variables: { ...formData, productId } });
      if (!updateData && errors) return errors.forEach(({ message }) => notify("error", message));
      notify("success", "Product has been updated!");
    } else {
      const { data: addData, errors } = await addProduct({ variables: { ...formData, beachBarId } });
      if (errors) return errors.forEach(({ message }) => notify("error", message));
      if (!addData) return notify("error", "");
      notify("success", "Product is added!");
      for (let { id, from, to, quantity } of limits.filter(({ isNew }) => isNew === true)) {
        const { data: reservData, errors: reservErrors } = await addReservationLimits({
          variables: {
            productId: addData.addProduct.id,
            from: from.format(dayjsFormat.ISO_STRING),
            to: to.format(dayjsFormat.ISO_STRING),
            limit: quantity,
            startTimeId: undefined,
            endTimeId: undefined,
          },
        });
        if (!reservData && reservErrors) return reservErrors.forEach(({ message }) => notify("error", message));
        setLimits(prev =>
          prev.map(limit => (limit.id === id ? { ...limit, id: reservData?.addProductReservationLimit.id } : limit))
        );
      }
    }
    // router.push("/dashboard/new");
    setTimeout(() => router.back(), 1000);
  };

  useEffect(() => {
    const reservationLimits = defaultValues?.reservationLimits;
    if (reservationLimits && reservationLimits.length > 0) {
      const newLimits = reservationLimits.map(({ id, from, to, limitNumber }) => ({
        id: id.toString(),
        from: dayjs(from),
        to: dayjs(to),
        quantity: limitNumber,
        isNew: false,
      }));
      setLimits(newLimits);
    }
  }, [defaultValues?.reservationLimits]);

  const categoryId = watch("categoryId");

  return (
    <Header.Crud
      fullPage
      title={(atEdit ? "Edit" : "Add") + " product"}
      closeIcon="chevron_left"
      cta={{ children: "Save", disabled: !formState.isValid, onClick: handleSubmit(onSubmit) }}
      onClose={() => router.back()}
    >
      {isLoading ? (
        <h2>Loading...</h2>
      ) : isError ? (
        <h2>Error</h2>
      ) : (
        <>
          <Dashboard.Form.Step header="Info">
            <Form.Group className={styles.form}>
              <Input
                placeholder="Name"
                value={watch("name")}
                overrideOnChange
                onChange={e => handleChange("name", e.target.value)}
              />
              <Input.Multiline
                placeholder="Description"
                optional
                defaultValue={watch("description")}
                onChange={e => handleChange("description", e.target.value)}
              />
              <div className="w100 flex-row-flex-start-flex-start">
                <Select
                  width="10em"
                  style={{ position: "relative" }}
                  onSelect={items => handleSelect("categoryId", items)}
                >
                  <Select.Button>
                    {PRODUCT_CATEGORY.find(({ id }) => id.toString() === categoryId)?.name || "Category"}
                  </Select.Button>
                  <Select.Modal style={{ width: "200%" }}>
                    <Select.Options>
                      {PRODUCT_CATEGORY.map(({ id, name }) => (
                        <Select.Item
                          key={"style_" + id}
                          id={id.toString()}
                          content={name}
                          defaultChecked={id.toString() === categoryId}
                        />
                      ))}
                    </Select.Options>
                  </Select.Modal>
                </Select>
                {categoryId && (
                  <div className={styles.components + " body-14"}>
                    <span>Contains:</span>
                    <BeachBar.Feature.Container style={{ marginTop: "0.5em" }}>
                      {PRODUCT_CATEGORY.find(({ id }) => id.toString() === categoryId)?.components.map(
                        ({ component, quantity }, i) => (
                          <BeachBar.Feature
                            key={i}
                            showQuantity
                            quantity={quantity}
                            feature={component.name}
                            iconId={component.publicId}
                          />
                        )
                      )}
                    </BeachBar.Feature.Container>
                  </div>
                )}
              </div>
              <div className={styles.inputs + " w100 flex-row-space-between-center flex--wrap"}>
                <Input.Number
                  label="Price"
                  optional
                  min={0.0}
                  max={999.99}
                  defaultValue={watch("price")}
                  onValue={newVal => handleChange("price", newVal, true)}
                />
                <div className="flex-row-flex-start-flex-start">
                  <Input.Number
                    label="Maximum people"
                    min={1}
                    defaultValue={watch("maxPeople")}
                    onValue={newVal => handleChange("maxPeople", newVal, true)}
                  />
                  <Next.Tooltip
                    type="info"
                    placement="top"
                    animation="shift-away"
                    maxWidth={240}
                    content="How many people can use your product? How many people does your product fits (has capacity for)."
                  />
                </div>
                <div className="flex-row-flex-start-flex-start">
                  <Input.Number
                    label="Minimum food spending"
                    optional
                    min={0.0}
                    max={999.99}
                    defaultValue={watch("minFoodSpending")}
                    onValue={newVal => handleChange("minFoodSpending", newVal, true)}
                  />
                  <Next.Tooltip
                    type="info"
                    placement="right"
                    animation="shift-away"
                    maxWidth={260}
                    content="How much are people required to pay in foods, snacks and drinks to use your product. This option can be combined if your product is FREE (price: 0.00)."
                  />
                </div>
              </div>
              <Next.UploadBtn
                label="Image (optional)"
                onChange={({ s3Url }) => s3Url && handleChange("imgUrl", s3Url)}
              />
            </Form.Group>
          </Dashboard.Form.Step>
          <Dashboard.Form.Step header="Availability (reservation limits)">
            <div>
              Set the dates that your product is available. Configure how many products of this type are available every
              hour per day, and you would like to able to be booked by users.
            </div>
            {!atEdit && <Dashboard.ReservationLimitNote />}
            <Dashboard.Form.ReservationLimits limits={limits} setLimits={setLimits} btnText={LIMIT_BUTTON_TEXT} />
          </Dashboard.Form.Step>
          {/* <h6 className="text--grey">Availability (reservation limits)</h6> */}
        </>
      )}
    </Header.Crud>
  );
};

Page.displayName = "DashboardProductPage";
