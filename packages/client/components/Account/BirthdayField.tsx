import { AccountFormValues, AccountHandleChangeProp } from "@/typings/user";
import { Input } from "@hashtag-design-system/components";
import dayjs from "dayjs";
import styles from "./BirthdayField.module.scss";

type Props = {
  defaultValues: Pick<Partial<AccountFormValues>, "birthdayDate" | "birthdayMonth" | "birthdayYear">;
};

export const BirthdayField: React.FC<Props & AccountHandleChangeProp> = ({
  defaultValues: { birthdayDate, birthdayMonth, birthdayYear },
  handleChange,
}) => (
  <div className={styles.container + " w100 flex-row-space-between-flex-end"}>
    <Input.Number
      min={1}
      max={31}
      label="Birthday"
      placeholder="Date"
      floatingplaceholder
      none
      defaultValue={birthdayDate}
      onValue={newVal => handleChange("birthdayDate", newVal, true)}
    />
    <Input.Number
      min={1}
      max={12}
      placeholder="Month"
      floatingplaceholder
      none
      defaultValue={birthdayMonth}
      onValue={newVal => handleChange("birthdayMonth", newVal, true)}
    />
    <Input.Number
      // min={1900}
      max={dayjs().year()}
      placeholder="Year"
      floatingplaceholder
      none
      defaultValue={birthdayYear}
      onValue={newVal => handleChange("birthdayYear", newVal, true)}
    />
  </div>
);

BirthdayField.displayName = "AccountBirthdayField";
