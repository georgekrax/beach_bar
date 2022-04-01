import Dashboard, { DashboardProductsPageProps } from "@/components/Dashboard";
import Header from "@/components/Header";
import Next from "@/components/Next";
import { Food, FoodsDocument, FoodsQuery, useAddFoodMutation, useUpdateFoodMutation } from "@/graphql/generated";
import { useDashboard, useHookForm } from "@/utils/hooks";
import { notify } from "@/utils/notify";
import { TABLES } from "@beach_bar/common";
import { Form, Input, Select } from "@hashtag-design-system/components";
import { GraphQLError } from "graphql";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import styles from "./Page.module.scss";

const { FOOD_CATEGORY } = TABLES;

type FormData = {
  categoryId: string;
} & Pick<Food, "name" | "ingredients" | "price" | "maxQuantity">;

type Props = {
  foodId?: string;
  atEdit?: boolean;
  defaultValues?: Partial<FormData>;
};

export const Page: React.FC<Props & Pick<DashboardProductsPageProps, "isLoading" | "isError">> = ({
  foodId,
  atEdit,
  isLoading = false,
  isError = false,
  defaultValues,
}) => {
  const router = useRouter();
  const { beachBarId } = useDashboard();

  const [addFood] = useAddFoodMutation();
  const [updateFood] = useUpdateFoodMutation();

  const { formState, watch, handleSubmit, ...form } = useForm<FormData>();
  const { handleChange, handleSelect } = useHookForm<FormData, undefined, Extract<keyof FormData, "categoryId">>({
    ...form,
    data: defaultValues,
    registerOptions: () => ({ required: true, minLength: 1 }),
    registeredFields: ["name", "categoryId", "price", "maxQuantity"],
  });

  const onSubmit = async (formData: FormData) => {
    if (!beachBarId) return notify("error", "");
    let errors: readonly GraphQLError[] | undefined = undefined;
    if (atEdit) {
      if (!foodId) return notify("error", "");
      const { errors: updateErrors } = await updateFood({ variables: { ...formData, id: foodId } });
      errors = updateErrors;
    } else {
      const { errors: addErrors } = await addFood({
        variables: { ...formData, beachBarId },
        update: (cache, { data }) => {
          const variables = { beachBarId: beachBarId.toString() };
          const cachedData = cache.readQuery<FoodsQuery>({ query: FoodsDocument, variables });
          if (!data) return;
          cache.writeQuery<FoodsQuery>({
            query: FoodsDocument,
            variables,
            data: { __typename: "Query", foods: [...(cachedData?.foods || []), data.addFood].flat() },
          });
        },
      });
      errors = addErrors;
    }
    if (errors) return errors.forEach(({ message }) => notify("error", message));
    notify("success", `Food ${atEdit ? "has been updated" : "is added"}!`);
    // router.push("/dashboard/new");
    setTimeout(() => router.back(), 1000);
  };

  const categoryId = watch("categoryId");

  return (
    <Header.Crud
      fullPage
      closeIcon="chevron_left"
      onClose={() => router.back()}
      title={(atEdit ? "Edit" : "Add") + " food"}
      cta={{ children: "Save", disabled: !formState.isValid, onClick: handleSubmit(onSubmit) }}
    >
      {isLoading ? (
        <h2>Loading...</h2>
      ) : isError ? (
        <h2>Error</h2>
      ) : (
        <Dashboard.Form.Step header="Info">
          <Form.Group className={styles.form}>
            <Input
              placeholder="Name"
              value={watch("name")}
              overrideOnChange
              onChange={e => handleChange("name", e.target.value)}
            />
            <Input
              optional
              overrideOnChange
              placeholder="Ingredients"
              value={watch("ingredients")}
              onChange={e => handleChange("ingredients", e.target.value)}
              secondhelptext={{ value: 'Seperate values with comma ","' }}
            />
            <Select
              width="inherit"
              style={{ position: "relative" }}
              onSelect={items => handleSelect("categoryId", items)}
            >
              <Select.Button>
                {FOOD_CATEGORY.find(({ id }) => id.toString() === categoryId)?.name || "Category"}
              </Select.Button>
              <Select.Modal style={{ width: "100%" }}>
                <Select.Options>
                  {FOOD_CATEGORY.map(({ id, name }) => (
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
            <div className={styles.numInputs + " w100 flex-row-space-between-center"}>
              <Input.Number
                label="Price"
                optional
                min={0.1}
                max={999.99}
                defaultValue={watch("price") || 3}
                onValue={newVal => handleChange("price", newVal, true)}
              />
              <div className="flex-row-flex-start-flex-start">
                <Input.Number
                  label="Maximum quantity"
                  optional
                  min={1}
                  max={999}
                  defaultValue={watch("maxQuantity") || 9}
                  onValue={newVal => handleChange("maxQuantity", newVal, true)}
                />
                <Next.Tooltip
                  type="info"
                  placement="left"
                  animation="shift-away"
                  maxWidth={260}
                  content="How many foods can a user buy during a single reservation / payment."
                />
              </div>
            </div>
          </Form.Group>
        </Dashboard.Form.Step>
      )}
    </Header.Crud>
  );
};

Page.displayName = "DashboardFoodsPage";
