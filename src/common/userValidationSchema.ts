import * as yup from "yup";

export const emailNotLongEnough = "Email should be at least five (5) characters";
export const passwordNotLongEnough = "Password should be at least five (5) characters";
export const invalidEmail = "Email should be a valid one";

export const userValidationSchema = yup.object().shape({
  email: yup.string().min(5, emailNotLongEnough).max(85).email(invalidEmail).required(),
  password: yup.string().min(5, passwordNotLongEnough).max(60).required(),
});

export async function validateUserSchema(email: string, password: string): Promise<any> {
  await userValidationSchema.validate({ email, password }, { abortEarly: true }).catch((err) => {
    err.errors.forEach((err) => {
      throw new Error(`Something went wrong: ${err}`);
    });
  });
}
