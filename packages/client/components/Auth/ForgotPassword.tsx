<<<<<<< HEAD:packages/client/components/Auth/ForgotPassword.tsx
import Feedback from "@/components/Feedback";
import { useSendForgotPasswordLinkMutation } from "@/graphql/generated";
import { ApolloGraphQLErrors } from "@/typings/graphql";
import { emailSchema } from "@/utils/yup";
import { Input } from "@hashtag-design-system/components";
import { yupResolver } from "@hookform/resolvers/yup";
import { AnimationControls } from "framer-motion";
import { useState } from "react";
import { useController, useForm } from "react-hook-form";
import { otherVariants } from "./Auth";
import {Container, FormGroup} from "./Container";
import { CTA } from "./CTA";

type FormData = {
  email: string;
};

type Props = {
  animationControls: AnimationControls;
};

export const ForgotPassword: React.FC<Props> = ({ animationControls }) => {
  const [graphqlErrors, setGraphqlErrors] = useState<ApolloGraphQLErrors>([]);
  const [success, setSuccess] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(emailSchema) });
  const { field: email } = useController<FormData, "email">({ name: "email", control });

  const [sendForgotPasswordLink] = useSendForgotPasswordLinkMutation();

  const onSubmit = async ({ email }: FormData) => {
    const { data, errors } = await sendForgotPasswordLink({ variables: { email } });
    setGraphqlErrors(errors);
    if (!errors && data?.sendForgotPasswordLink.success) setSuccess(true);
  };

  return (
    <Container
      initial="hidden"
      variants={otherVariants}
      controls={animationControls}
      custom={2}
      description="Enter the email address associated with your account"
      other={{ text: "Didn't receive the email?", link: "Send again" }}
      handleClick={handleSubmit(onSubmit)}
    >
      <FormGroup onSubmit={handleSubmit(onSubmit)}>
        <Input
          {...email}
          placeholder="Email"
          forwardref={email.ref}
          secondhelptext={{ error: true, value: errors.email?.message }}
        />
        <CTA btn="Reset password" errors={graphqlErrors}>
          {success && (
            <Feedback.Success>
              Please check your email inbox. Follow the instructions to get a new one!
            </Feedback.Success>
          )}
        </CTA>
      </FormGroup>
    </Container>
  );
};

ForgotPassword.displayName = "AuthForgotPassword";
=======
import Feedback from "@/components/Feedback";
import { useSendForgotPasswordLinkMutation } from "@/graphql/generated";
import { ApolloGraphQLErrors } from "@/typings/graphql";
import { emailSchema } from "@/utils/yup";
import { Input } from "@hashtag-design-system/components";
import { yupResolver } from "@hookform/resolvers/yup";
import { AnimationControls } from "framer-motion";
import { useState } from "react";
import { useController, useForm } from "react-hook-form";
import { otherVariants } from "./Auth";
import Auth from "./index";

type FormData = {
  email: string;
};

type Props = {
  animationControls: AnimationControls;
};

export const ForgotPassword: React.FC<Props> = ({ animationControls }) => {
  const [graphqlErrors, setGraphqlErrors] = useState<ApolloGraphQLErrors>([]);
  const [success, setSuccess] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(emailSchema) });
  const { field: email } = useController<FormData, "email">({ name: "email", control });

  const [sendForgotPasswordLink] = useSendForgotPasswordLinkMutation();

  const onSubmit = async ({ email }: FormData) => {
    const { data, errors } = await sendForgotPasswordLink({ variables: { email } });
    setGraphqlErrors(errors);
    if (!errors && data?.sendForgotPasswordLink.success) setSuccess(true);
  };

  return (
    <Auth.Container
      initial="hidden"
      variants={otherVariants}
      controls={animationControls}
      custom={2}
      description="Enter the email address associated with your account"
      other={{ text: "Didn't receive the email?", link: "Send again" }}
      handleClick={handleSubmit(onSubmit)}
    >
      <Auth.Container.FormGroup onSubmit={handleSubmit(onSubmit)}>
        <Input
          {...email}
          placeholder="Email"
          forwardref={email.ref}
          secondhelptext={{ error: true, value: errors.email?.message }}
        />
        <Auth.CTA btn="Reset password" errors={graphqlErrors}>
          {success && (
            <Feedback.Success>
              Please check your email inbox. Follow the instructions to get a new one!
            </Feedback.Success>
          )}
        </Auth.CTA>
      </Auth.Container.FormGroup>
    </Auth.Container>
  );
};

ForgotPassword.displayName = "AuthForgotPassword";
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff:packages/client/components/AuthForm/ForgotPassword.tsx
