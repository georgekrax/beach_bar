import { useSignUpMutation } from "@/graphql/generated";
import { ApolloGraphQLErrors } from "@/typings/graphql";
import { SignUpFormData } from "@/typings/user";
import { signUpSchema } from "@/utils/yup";
import { Input } from "@hashtag-design-system/components";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import AuthForm, { AuthFormCTAProps } from "./index";

type Props = {
  forgotPassword?: boolean;
  handleFormSubmit?: (formData: Omit<SignUpFormData, "confirmPassword">) => Promise<{ errors?: ApolloGraphQLErrors } | undefined>;
};

type FProps = Props & Partial<Pick<AuthFormCTAProps, "btn">>;

export const SignUp: React.FC<FProps> = ({ forgotPassword = false, btn = "Sign up", handleFormSubmit }) => {
  const [graphqlErrors, setGraphqlErrors] = useState<ApolloGraphQLErrors>([]);
  const { register, handleSubmit, trigger, errors } = useForm<SignUpFormData>({
    resolver: yupResolver(signUpSchema),
  });
  const [signup] = useSignUpMutation();

  const onSubmit = async ({ email, password }: SignUpFormData) => {
    let errors: typeof graphqlErrors = undefined;
    if (!forgotPassword) {
      const { errors: signUpErrors } = await signup({
        variables: { userCredentials: { email, password }, isPrimaryOwner: false },
      });
      errors = signUpErrors;
    } else if (handleFormSubmit) {
      const res = await handleFormSubmit({ email, password });
      errors = res?.errors;
    }
    setGraphqlErrors(errors);
  };

  return (
    <AuthForm.Container.FormGroup onSubmit={handleSubmit(onSubmit)}>
      <Input
        placeholder="Email"
        name="email"
        forwardref={register}
        secondhelptext={{ error: true, value: errors.email?.message }}
      />
      <Input.Password
        placeholder="Password"
        name="password"
        forwardref={register}
        secondhelptext={{ error: true, value: errors.password?.message }}
      />
      <Input
        placeholder="Password"
        type="password"
        name="confirmPassword"
        forwardref={register}
        secondhelptext={{
          error: true,
          value: errors.confirmPassword?.message,
        }}
        onChange={async () => await trigger("confirmPassword")}
        onBlur={async () => await trigger("confirmPassword")}
      />
      <AuthForm.CTA btn={btn} errors={graphqlErrors} />
    </AuthForm.Container.FormGroup>
  );
};

SignUp.displayName = "AuthFormSignUp";
