import { AccountFormValues, AccountHandleChangeProp } from "@/typings/user";
import { Input } from "@hashtag-design-system/components";
import { UseFormReturn } from "react-hook-form";

type BasicInfoProps = {
  defaultValues: Pick<Partial<AccountFormValues>, "email" | "firstName" | "lastName">;
};

export const BasicInfo: React.FC<
  BasicInfoProps & AccountHandleChangeProp & Pick<UseFormReturn<AccountFormValues>["formState"], "errors">
> = ({ defaultValues: { email, firstName, lastName }, errors, handleChange }) => {
  return (
    <>
      <Input
        placeholder="Email"
        type="email"
        defaultValue={email}
        onChange={e => handleChange("email", e.target.value)}
        secondhelptext={{ error: true, value: errors.email?.message }}
      />
      <Input
        placeholder="First name"
        defaultValue={firstName}
        onChange={e => handleChange("firstName", e.target.value)}
        secondhelptext={{ error: true, value: errors.firstName?.message }}
      />
      <Input
        placeholder="Last name"
        defaultValue={lastName}
        onChange={e => handleChange("lastName", e.target.value)}
        secondhelptext={{ error: true, value: errors.lastName?.message }}
      />
    </>
  );
};

BasicInfo.displayName = "AccountBasicInfo";

type LocationDetailsProps = {
  defaultValues: Pick<Partial<AccountFormValues>, "city" | "addressLine" | "zipCode">;
};

export const LocationDetails: React.FC<LocationDetailsProps & AccountHandleChangeProp> = ({
  defaultValues: { city, addressLine, zipCode },
  handleChange,
}) => {
  return (
    <>
      <Input placeholder="City" defaultValue={city} onChange={e => handleChange("city", e.target.value)} />
      <Input
        placeholder="Address lime"
        defaultValue={addressLine}
        onChange={e => handleChange("addressLine", e.target.value)}
      />
      <Input placeholder="Zip code" defaultValue={zipCode} onChange={e => handleChange("zipCode", e.target.value)} />
    </>
  );
};

LocationDetails.displayName = "AccountLocationDetails";
