export type LoginFormData = {
  email: string;
  password: string;
};

export type SignUpFormData = LoginFormData & {
  confirmPassword: string;
};

export const OAuthProviders = ["Google", "Facebook", "Instagram"] as const;
export type OAuthProvider = typeof OAuthProviders[number];

export const AccountDefaultFormValues = {
  email: "",
  firstName: "",
  lastName: "",
  city: "",
  addressLine: "",
  zipCode: "",
  birthdayDate: 1,
  birthdayMonth: 1,
  birthdayYear: 1,
  trackHistory: false,
  phoneNumber: "",
  honorificTitle: "",
  countryId: "",
  telCountryId: "",
  imgUrl: "",
};

export type AccountFormValues = typeof AccountDefaultFormValues;

export type AccountHandleChangeProp = {
  handleChange: (field: keyof AccountFormValues, newVal: string | number | boolean, checkCurVal?: boolean) => void
}