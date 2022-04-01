import Feedback from "@/components/Feedback";
import { useSendForgotPasswordLinkMutation } from "@/graphql/generated";
import { emailSchema } from "@/utils/yup";
import { Form, Input } from "@hashtag-design-system/components";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { CTA } from "./CTA";

type FormData = {
  email: string;
};

type Props = {};

export const ForgotPassword: React.FC<Props> = () => {
  const [graphqlError, setGraphqlError] = useState<string | undefined>();
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [sendForgotPasswordLink] = useSendForgotPasswordLinkMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(emailSchema) });

  const onSubmit = async ({ email }: FormData) => {
    const { data, errors } = await sendForgotPasswordLink({ variables: { email } });
    if (errors || !data?.sendForgotPasswordLink) setGraphqlError(errors?.[0].message || "Something went wrong");
    else setIsSuccessful(true);
  };

  return (
    <Form.Control
      as="form"
      isInvalid={!!errors.email}
      onSubmit={e => {
        e.preventDefault();
        handleSubmit(onSubmit)(e);
      }}
    >
      <Form.Label>Email</Form.Label>
      <Input {...register("email", { required: true })} placeholder="Email" />
      <Form.ErrorMessage>{errors.email?.message}</Form.ErrorMessage>
      <CTA btn="Reset password" errors={graphqlError}>
        {isSuccessful && (
          <Feedback.Success>
            Please check your email inbox. Follow the instructions to create a new password.
          </Feedback.Success>
        )}
      </CTA>
    </Form.Control>
  );
};

ForgotPassword.displayName = "AuthForgotPassword";
