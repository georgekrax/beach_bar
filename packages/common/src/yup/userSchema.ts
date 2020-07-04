import * as yup from "yup";

export const emailNotLongEnough =
  "Email should be at least five (5) characters";
export const passwordNotLongEnough =
  "Password should be at least five (5) characters";
export const invalidEmail = "Email should be a valid one";

export const userValidationSchema = yup.object().shape({
  email: yup
    .string()
    .min(5, emailNotLongEnough)
    .max(255)
    .email(invalidEmail)
    .required(),
  password: yup.string().min(5, passwordNotLongEnough).max(60).required(),
});

export async function validateUserSchema(
  email: string,
  password: string
): Promise<any> {
  await userValidationSchema
    .validate({ email, password }, { abortEarly: true })
    .catch((err) => {
      err.errors.forEach((err) => {
        throw new Error(`Something went wrong: ${err}`);
      });
    });
}

export const emailValidationSchema = yup.object().shape({
  email: yup
    .string()
    .min(5, emailNotLongEnough)
    .max(255)
    .email(invalidEmail)
    .required(),
});

export async function validateEmailSchema(email: string): Promise<any> {
  await emailValidationSchema
    .validate({ email }, { abortEarly: true })
    .catch((err) => {
      err.errors.forEach((err) => {
        throw new Error(err.toString());
      });
    });
}

export const passwordValidationSchema = yup.object().shape({
  password: yup.string().min(5, passwordNotLongEnough).max(60).required(),
});

export async function validatePasswordSchema(password: string): Promise<any> {
  await passwordValidationSchema
    .validate({ password }, { abortEarly: true })
    .catch((err) => {
      err.errors.forEach((err) => {
        throw new Error(err.toString());
      });
    });
}
