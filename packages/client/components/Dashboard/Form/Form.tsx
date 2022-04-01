import Next from "@/components/Next";
import { DATA } from "@/config/data";
import { SettingsFormData } from "@/typings/beachBar";
import { parseHour } from "@/utils/format";
import { COMMON_CONFIG, TABLES } from "@beach_bar/common";
import { Input, Select, SelectedItems, Switch } from "@hashtag-design-system/components";
import range from "lodash/range";
import { UseFormReturn } from "react-hook-form";
import styles from "./Form.module.scss";
import { Item } from "./Item";
import { ProgressBar } from "./ProgressBar";
import { ReservationLimits } from "./ReservationLimits";
import { Step } from "./Step";

const { MIN_HOUR, MAX_HOUR } = DATA;

const { STYLE } = COMMON_CONFIG.DATA.searchFilters;

const MODAL_WIDTH = 128 / 16 + "rem";

type SubComponents = {
  Item: typeof Item;
  Step: typeof Step;
  ProgressBar: typeof ProgressBar;
  ReservationLimits: typeof ReservationLimits;
};

type Props = {
  atNew?: boolean;
  handleToggle?: (e: React.SyntheticEvent<HTMLElement, Event>) => void;
  handleChange: (
    fieldName: keyof SettingsFormData,
    newVal: SettingsFormData[typeof fieldName],
    checkCurVal?: boolean
  ) => void;
} & Pick<Partial<UseFormReturn<SettingsFormData>>, "watch">;

export const Form: React.FC<Props> & SubComponents = ({ atNew = false, watch, handleToggle, handleChange }) => {
  const handleSelect = (
    field: Extract<Parameters<typeof handleChange>["0"], "categoryId" | "styleIds" | "openingTimeId" | "closingTimeId">,
    items: SelectedItems[]
  ) => {
    const selected = items.filter(({ selected }) => selected);
    if (selected.length > 0) handleChange(field, field === "styleIds" ? selected.map(({ id }) => id) : selected[0].id);
    else handleChange(field, "");
  };

  const isControlled = !!watch;

  return (
    <div>
      <Step header="General info">
        <Input
          placeholder="Name"
          overrideOnChange={isControlled}
          value={watch ? watch("name") : ""}
          onChange={e => handleChange("name", e.target.value)}
        />
        <Input.Multiline
          placeholder="Description"
          defaultValue={watch ? watch("description") : ""}
          onChange={e => handleChange("description", e.target.value)}
        />
        <div className={styles.category + " w100 flex-row-space-between-center"}>
          <Select onSelect={items => handleSelect("categoryId", items)}>
            <Select.Button>Category</Select.Button>
            <Select.Modal fullWidth>
              <Select.Options>
                {TABLES.BEACH_BAR_CATEGORY.map(({ id, name }) => (
                  <Select.Item
                    key={"category_" + id}
                    id={id.toString()}
                    content={name}
                    state={name === "Swimming pool" ? "disabled" : undefined}
                    defaultChecked={watch ? watch("categoryId") === id.toString() : false}
                  />
                ))}
              </Select.Options>
            </Select.Modal>
          </Select>
          <Select multiSelectable onSelect={items => handleSelect("styleIds", items)}>
            <Select.Button>Style</Select.Button>
            <Select.Modal fullWidth>
              <Select.Options>
                {Object.values(STYLE).map(({ id, name }) => (
                  <Select.Item
                    key={"style_" + id}
                    id={id.toString()}
                    content={name}
                    defaultChecked={watch ? watch("styleIds")?.includes(id.toString()) : false}
                  />
                ))}
              </Select.Options>
            </Select.Modal>
          </Select>
        </div>
        <Next.UploadBtn
          label="Thumbnail (primary) image"
          onChange={({ s3Url }) => s3Url && handleChange("thumbnailUrl", s3Url)}
        />
      </Step>
      <Step header="Operations">
        {/* <Input placeholder="Business's email" type="email" /> */}
        <Input
          placeholder="Business's phone number"
          overrideOnChange={isControlled}
          value={watch ? watch("contactPhoneNumber") : ""}
          onChange={e => handleChange("contactPhoneNumber", e.target.value)}
        />
        <div className={styles.options + " flex-column-flex-start-flex-start"}>
          <Switch
            defaultChecked={watch ? watch("hidePhoneNumber") : false}
            onChange={e => handleChange("hidePhoneNumber", e.target.value === "true" ? false : true)}
            label={
              <div className="flex-row-space-between-center">
                Don't display your business's phone number on your details page
                <Next.Tooltip
                  type="info"
                  placement="right"
                  animation="shift-away"
                  content="Your bussiness's phone number is stored on our databases and displayed to your details page, in order for us and users to be able to contact you. However, if you want to hide it from users set this option to true."
                />
              </div>
            }
          />
          <Switch
            defaultChecked={watch ? watch("zeroCartTotal") : undefined}
            onChange={e => handleChange("zeroCartTotal", e.target.value === "true" ? false : true)}
            label={
              <div className="flex-row-space-between-center">
                Allow customers to pay nothing (€ 0.00) to buy and reserve your products
                <Next.Tooltip
                  type="info"
                  placement="right"
                  animation="shift-away"
                  content="Depending on the products and foods a user buys and reserves through our application, its shopping cart total price varies. If you add free products or foods with the price of 0.00, and you do not mind users to buy only products that are free and don't pay nothing, set this option to true."
                />
              </div>
            }
          />
          {!atNew && (
            <>
              <Switch
                defaultChecked={watch ? watch("displayRegardlessCapacity") : undefined}
                onChange={e => handleChange("displayRegardlessCapacity", e.target.value === "true" ? false : true)}
                label={
                  <div className="flex-row-space-between-center">
                    Display regardless capacity
                    <Next.Tooltip
                      type="info"
                      placement="right"
                      animation="shift-away"
                      content="Set true, if you would us to show - display your #beach_bar on search results, even if you do not have capacity to host any more people."
                    />
                  </div>
                }
              />
              <Switch
                defaultChecked={watch ? watch("isActive") : undefined}
                onChange={e => handleChange("isActive", e.target.value === "true" ? false : true)}
                label={
                  <div className="flex-row-space-between-center">
                    Active
                    <Next.Tooltip
                      type="info"
                      placement="right"
                      animation="shift-away"
                      content="Toggle wether your business is active and is shown in search results. For example, you can turn it off during the winter months, and turn it on again during the spring to autumn period."
                    />
                  </div>
                }
              />
            </>
          )}
        </div>
        <div>
          <label className="body-14">What time are you open?</label>
          <div className={styles.hours + " flex-row-flex-start-center"}>
            <Select
              width={MODAL_WIDTH}
              onToggle={handleToggle}
              onSelect={items => handleSelect("openingTimeId", items)}
            >
              <Select.Button>Opening</Select.Button>
              <Select.Modal fullWidth>
                <Select.Options>
                  {range(MIN_HOUR, 13).map(val => (
                    <Select.Item
                      key={"category_" + val}
                      id={val.toString()}
                      content={parseHour(val)}
                      defaultChecked={watch ? watch("openingTimeId") === val.toString() : false}
                    />
                  ))}
                </Select.Options>
              </Select.Modal>
            </Select>
            <span>&mdash;</span>
            <Select
              width={MODAL_WIDTH}
              onToggle={handleToggle}
              onSelect={items => handleSelect("closingTimeId", items)}
            >
              <Select.Button>Closing</Select.Button>
              <Select.Modal fullWidth>
                <Select.Options>
                  {range(16, MAX_HOUR + 1).map(val => (
                    <Select.Item
                      key={"category_" + val}
                      id={val.toString()}
                      content={parseHour(val)}
                      defaultChecked={watch ? watch("closingTimeId") === val.toString() : false}
                    />
                  ))}
                </Select.Options>
              </Select.Modal>
            </Select>
          </div>
        </div>
      </Step>
    </div>
  );
};

Form.Item = Item;
Form.Step = Step;
Form.ProgressBar = ProgressBar;
Form.ReservationLimits = ReservationLimits;

Form.displayName = "DashboardForm";
