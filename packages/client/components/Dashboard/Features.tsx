import Icons from "@/components/Icons";
import Next from "@/components/Next";
import Search, { SearchFiltersBtnProps } from "@/components/Search";
import {
  BeachBarFeature,
  useAddBeachBarFeatureMutation,
  useDeleteBeachBarFeatureMutation,
  useUpdateBeachBarFeatureMutation,
} from "@/graphql/generated";
import { useDashboard, useHookForm, useSearch } from "@/utils/hooks";
import { notify } from "@/utils/notify";
import { TABLES } from "@beach_bar/common";
import { Button, Input } from "@hashtag-design-system/components";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./Features.module.scss";

const { BEACH_BAR_SERVICE, BEACH_BAR_SERVICE_OBJ } = TABLES;

type FormData = Pick<BeachBarFeature, "quantity" | "description">;

type Params = Parameters<Required<SearchFiltersBtnProps>["onClick"]>;

type ActiveFeature = Partial<FormData> & { serviceId: string } & Pick<SearchFiltersBtnProps, "defaultChecked"> &
  Pick<typeof BEACH_BAR_SERVICE_OBJ["FOOD_SNACKS"], "id" | "name" | "publicId">;

type Props = {
  atNew?: boolean;
};

export const Features: React.FC<Props> = ({ atNew = false }) => {
  const [activeFeature, setActiveFeature] = useState<ActiveFeature | undefined>();

  const { beachBarId, beachBar, loading } = useDashboard({ fetch: true });
  const { filterIds, handleFilterIds } = useSearch({ skipDataFetch: true });

  const [addFeature] = useAddBeachBarFeatureMutation();
  const [updateFeature] = useUpdateBeachBarFeatureMutation();
  const [deleteFeature] = useDeleteBeachBarFeatureMutation();

  const { formState, watch, handleSubmit, ...form } = useForm<FormData>();
  // @ts-expect-error
  const { handleChange } = useHookForm<FormData>(form);

  const parsedFeatures = useMemo(
    () =>
      BEACH_BAR_SERVICE.map(feature => {
        const barFeature = beachBar?.features.find(({ id }) => id === feature.id.toString());
        return { ...barFeature, ...feature, defaultChecked: !!barFeature };
      }),
    [beachBar?.features]
  );

  const handleClick = async ({ id, isChecked }: Params["0"], e: Params["1"]) => {
    if (!beachBarId) return notify("error", "");
    if (!isChecked) return e.preventDefault();
    const { data, errors } = await addFeature({
      variables: { beachBarId, featureId: id, description: undefined, quantity: 1 },
    });
    if (errors) return errors.forEach(({ message }) => notify("error", message));
    if (!data) return notify("error", "");
    const newActiveFeature = parsedFeatures.find(feature => feature.id.toString() === id);
    setActiveFeature(
      newActiveFeature
      // @ts-ignore
        ? { ...newActiveFeature, id: +data.addBeachBarFeature.id as any, serviceId: newActiveFeature.id.toString() }
        : undefined
    );
    if (newActiveFeature) {
      const { quantity, description } = newActiveFeature;
      handleChange("quantity", quantity);
      handleChange("description", description);
    }
  };

  const handleEdit = async (formData: FormData) => {
    if (!activeFeature) return notify("error", "");
    const { data, errors } = await updateFeature({ variables: { ...formData, id: activeFeature.id.toString() } });
    if (!data && errors) return errors.forEach(({ message }) => notify("error", message));
    notify("success", "Feature updated!");
  };

  const handleDelete = async () => {
    if (!activeFeature) return notify("error", "");
    const { data, errors } = await deleteFeature({ variables: { id: activeFeature.id.toString() } });
    if (!data && errors) return errors.forEach(({ message }) => notify("error", message));
    notify("success", "Feature removed.");
    await handleFilterIds(filterIds.filter(filterId => filterId !== activeFeature.serviceId));
  };

  useEffect(() => {
    handleFilterIds(parsedFeatures.filter(({ defaultChecked }) => defaultChecked).map(({ id }) => id.toString()));
  }, [parsedFeatures]);

  return (
    <div
      className={
        (atNew ? "" : styles.atDashboard + " ") +
        `w100 flex-row-reverse-space-between-flex-start ${atNew ? "flex--wrap" : ""}`
      }
    >
      <motion.div
        className={styles.edit + " w--inherit shadow-sm flex-row-space-between-flex-end"}
        animate={{ opacity: activeFeature ? 1 : 0.4 }}
      >
        <div className="flex-row-center-inherit">
          <Input.Number
            label="Quantity"
            min={1}
            max={10}
            value={watch("quantity") || activeFeature?.quantity}
            onValue={newVal => handleChange("quantity", newVal, true)}
          />
          <Input
            optional
            overrideOnChange
            placeholder="Description"
            value={watch("description")}
            onChange={e => handleChange("description", e.target.value)}
          />
        </div>
        <div className="flex-row-center-center">
          <Button variant="secondary" className={styles.deleteBtn} onClick={handleDelete}>
            <Icons.TrashBin width={16} height={16} />
          </Button>
          <Button variant="primary" className={styles.editBtn} onClick={handleSubmit(handleEdit)}>
            Edit
          </Button>
        </div>
      </motion.div>
      <Next.Loading isScreen isLoading={loading}>
        {beachBar?.features.length === 0 ? (
          <Next.DoNotHave emoji="😶" msg="You have not added any features to your #beach_bar." />
        ) : (
          <Search.Filters.Services
            atDashboard
            className={styles.list}
            item={{ checkbox: false, onClick: handleClick }}
            features={parsedFeatures}
          />
        )}
      </Next.Loading>
    </div>
  );
};
