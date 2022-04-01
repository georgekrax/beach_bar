import { useSignUpMutation } from "@/graphql/generated";
import { ApolloGraphQLErrors } from "@/typings/graphql";
import { SignUpFormData } from "@/typings/user";
import { signUpSchema } from "@/utils/yup";
import { Form, Input } from "@hashtag-design-system/components";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CTA } from "./CTA";
import { AuthCTAProps } from "./index";

type Props = Partial<Pick<AuthCTAProps, "btn">> & {
  atForgotPassword?: boolean;
  handleFormSubmit?: (
    formData: Omit<SignUpFormData, "confirmPassword">
  ) => Promise<{ errors?: ApolloGraphQLErrors } | undefined>;
};

export const SignUp: React.FC<Props> = ({ atForgotPassword = false, btn = "Sign up", handleFormSubmit }) => {
  const [graphqlError, setGraphqlError] = useState<string | undefined>();

  const [signup] = useSignUpMutation();

  const {
    register,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({ resolver: yupResolver(signUpSchema) });

  const onSubmit = async ({ email, password }: SignUpFormData) => {
    if (!atForgotPassword) {
      const { errors: signUpErrors } = await signup({
        variables: { userCredentials: { email, password }, isPrimaryOwner: false },
      });
      setGraphqlError(signUpErrors?.[0].message);
    } else if (handleFormSubmit) {
      const res = await handleFormSubmit({ email, password });
      setGraphqlError(res?.errors?.[0].message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Form.Control isInvalid={!!errors.email}>
        <Input {...register("email")} placeholder="Email" />
        <Form.ErrorMessage>{errors.email?.message}</Form.ErrorMessage>
      </Form.Control>
      <Form.Control isInvalid={!!errors.password}>
        <Input.Password {...register("password")} placeholder="Password" form="sign_up" />
        <Form.ErrorMessage>{errors.password?.message}</Form.ErrorMessage>
      </Form.Control>
      <Form.Control isInvalid={!!errors.confirmPassword}>
        <Input.Password
          {...register("confirmPassword", {
            onChange: () => trigger("confirmPassword"),
            onBlur: () => trigger("confirmPassword"),
          })}
          placeholder="Confirm password"
          form="login"
        />
        <Form.ErrorMessage>{errors.confirmPassword?.message}</Form.ErrorMessage>
      </Form.Control>
      {/* <Input
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
      /> */}
      <CTA btn={btn} errors={graphqlError} />
    </form>
  );
};

SignUp.displayName = "AuthSignUp";
