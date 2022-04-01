import Dashboard from "@/components/Dashboard";
import Next from "@/components/Next";
import { useUpdateBeachBarMutation } from "@/graphql/generated";
import { SettingsFormData } from "@/typings/beachBar";
import { useDashboard, useHookForm } from "@/utils/hooks";
import { notify } from "@/utils/notify";
import Image from "next/image";
import { useForm } from "react-hook-form";
import styles from "./Settings.module.scss";

export const Settings: React.FC = () => {
  const { beachBar, loading } = useDashboard({ fetch: true });

  const location = beachBar?.location;

  const [updateBeachBar] = useUpdateBeachBarMutation();
  const { formState, watch, handleSubmit, ...form } = useForm<SettingsFormData>({ mode: "onChange" });
  // // @ts-expect-error
  const { handleChange } = useHookForm<SettingsFormData>({
    ...form,
    // @ts-expect-error
    data: {
      ...beachBar,
      ...location,
      categoryId: beachBar?.category.id,
      styleIds: beachBar?.styles?.map(({ id }) => id) || [],
      openingTimeId: beachBar?.openingTime.id,
      closingTimeId: beachBar?.closingTime.id,
    },
    registerOptions: () => ({ required: true, minLength: 1 }),
    registeredFields: [
      "name",
      "description",
      // "thumbnailUrl",
      "categoryId",
      "contactPhoneNumber",
      // "zeroCartTotal",
      // "hidePhoneNumber",
      "openingTimeId",
      "closingTimeId",
      "address",
      "country",
      "city",
      "latitude",
      "longitude",
    ],
  });

  const handleUpdate = async (formData: SettingsFormData) => {
    if (!beachBar) return notify("error", "");

    const { data, errors } = await updateBeachBar({ variables: { beachBarId: beachBar.id.toString(), ...formData } });
    if (!data && errors) errors.forEach(({ message }) => notify("error", message));
    else notify("success", "Your settings have been updated!");
  };

  return (
    <div>
      <Dashboard.AddBtn
        heading="Settings"
        a={false}
        showIcon={false}
        btnText="Save"
        onClick={handleSubmit(handleUpdate)}
      />
      <Next.Loading isScreen isLoading={loading}>
        <div className={styles.container + " flex-row-flex-start-flex-start"}>
          <Dashboard.Form watch={watch} handleChange={handleChange} />
          <div className={styles.secondColumn + " flex-column-reverse-flex-start-flex-start"}>
            <Dashboard.Form.Step header="Location details">
              <Dashboard.Location
                handleChange={handleChange}
                defaultValues={{
                  ...location,
                  country: location?.country.name,
                  city: location?.city.name,
                  region: location?.region?.name,
                }}
              />
            </Dashboard.Form.Step>
            <div className={styles.thumbnail + " flex-row-center-center"}>
              {beachBar && (
                <Image
                  src={beachBar.thumbnailUrl}
                  width={480}
                  height={300}
                  objectFit="cover"
                  // layout="fill"
                />
              )}
            </div>
          </div>
        </div>
      </Next.Loading>
    </div>
  );
};

Settings.displayName = "DashboardSettings";
