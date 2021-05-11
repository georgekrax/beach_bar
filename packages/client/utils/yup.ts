import dayjs from "dayjs";
import * as yup from "yup";

export const emailSchema = yup.object().shape({
  email: yup.string().email("Please provide a valid email address").required("Please provide an email address"),
});

export const loginSchema = emailSchema.shape({
  password: yup.string().required("Please provide a password"),
});

export const passwordSchema = yup.object().shape({
  password: yup
    .string()
    .min(8, "Password should be at least ${min} characters long")
    .required("Please provide a password"),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

export const signUpSchema = emailSchema.concat(passwordSchema);

export const monthSchema = yup.object().shape({
  month: yup.number().min(1).max(12).required("Please provide a valid month"),
});

export const yearSchema = yup.object().shape({
  year: yup
    .number()
    .min(dayjs().year(), "Year must be greater than or equal to ${min}")
    .max(dayjs().year() + 100)
    .required("Please provide valid year"),
});

export const textSchema = yup.string().max(255);

export const cardHolderSchema = yup.object().shape({
  cardholderName: textSchema.required("Please provide a cardholder name"),
});

export const verifyPaymentIdSchema = yup.object().shape({
  refCode: yup
    .string()
    .length(16, "The ID should have length of ${length} characters")
    .required("Please provide valid ID"),
});
