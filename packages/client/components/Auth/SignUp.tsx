import { useSignUpMutation } from "@/graphql/generated";
import { ApolloGraphQLErrors } from "@/typings/graphql";
import { SignUpFormData } from "@/typings/user";
import { signUpSchema } from "@/utils/yup";
import { Input } from "@hashtag-design-system/components";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useController, useForm } from "react-hook-form";
import { FormGroup } from "./Container";
import { CTA } from "./CTA";
import { AuthCTAProps } from "./index";

type Props = {
  forgotPassword?: boolean;
  handleFormSubmit?: (
    formData: Omit<SignUpFormData, "confirmPassword">
  ) => Promise<{ errors?: ApolloGraphQLErrors } | undefined>;
};

type FProps = Props & Partial<Pick<AuthCTAProps, "btn">>;

export const SignUp: React.FC<FProps> = ({ forgotPassword = false, btn = "Sign up", handleFormSubmit }) => {
  const [graphqlErrors, setGraphqlErrors] = useState<ApolloGraphQLErrors>([]);
  const {
    handleSubmit,
    trigger,
    control,
    formState: { errors },
  } = useForm<SignUpFormData>({ resolver: yupResolver(signUpSchema) });
  const { field: email } = useController<SignUpFormData, "email">({ name: "email", control });
  const { field: password } = useController<SignUpFormData, "password">({ name: "password", control });
  const { field: confirmPassword } = useController<SignUpFormData, "confirmPassword">({
    name: "confirmPassword",
    control,
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
    <FormGroup onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...email}
        placeholder="Email"
        forwardref={email.ref}
        secondhelptext={{ error: true, value: errors.email?.message }}
      />
      <Input.Password
        {...password}
        placeholder="Password"
        forwardref={password.ref}
        secondhelptext={{ error: true, value: errors.password?.message }}
      />
      <Input
        {...confirmPassword}
        placeholder="Password"
        type="password"
        forwardref={confirmPassword.ref}
        secondhelptext={{ error: true, value: errors.confirmPassword?.message }}
        onChange={() => trigger("confirmPassword")}
        onBlur={() => trigger("confirmPassword")}
      />
      <CTA btn={btn} errors={graphqlErrors} />
    </FormGroup>
  );
};

SignUp.displayName = "AuthSignUp";
