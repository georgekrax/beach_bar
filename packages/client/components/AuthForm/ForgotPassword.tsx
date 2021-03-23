import Feedback from "@/components/Feedback";
import { useSendForgotPasswordLinkMutation } from "@/graphql/generated";
import { ApolloGraphQLErrors } from "@/typings/graphql";
import { emailSchema } from "@/utils/yup";
import { Input } from "@hashtag-design-system/components";
import { yupResolver } from "@hookform/resolvers/yup";
import { AnimationControls } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { otherVariants } from "./AuthForm";
import AuthForm from "./index";

type FormData = {
  email: string;
};

type Props = {
  animationControls: AnimationControls;
};

export const ForgotPassword: React.FC<Props> = ({ animationControls }) => {
  const [graphqlErrors, setGraphqlErrors] = useState<ApolloGraphQLErrors>([]);
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, errors } = useForm<FormData>({
    resolver: yupResolver(emailSchema),
  });
  const [sendForgotPasswordLink] = useSendForgotPasswordLinkMutation();

  const onSubmit = async ({ email }: FormData) => {
    const { data, errors } = await sendForgotPasswordLink({ variables: { email } });
    setGraphqlErrors(errors);
    if (!errors && data?.sendForgotPasswordLink.success) setSuccess(true);
  };

  return (
    <AuthForm.Container
      initial="hidden"
      variants={otherVariants}
      controls={animationControls}
      custom={2}
      description="Enter the email address associated with your account"
      other={{
        text: "Didn't receive the email?",
        link: "Send again",
      }}
      handleClick={handleSubmit(onSubmit)}
    >
      <AuthForm.Container.FormGroup onSubmit={handleSubmit(onSubmit)}>
        <Input
          placeholder="Email"
          name="email"
          forwardref={register}
          secondhelptext={{ error: true, value: errors.email?.message }}
        />
        <AuthForm.CTA btn="Reset password" errors={graphqlErrors}>
          {success && (
            <Feedback.Success>
              Please check your email inbox. Follow the instructions to get a new one!
            </Feedback.Success>
          )}
        </AuthForm.CTA>
      </AuthForm.Container.FormGroup>
    </AuthForm.Container>
  );
};

ForgotPassword.displayName = "AuthFormForgotPassword";
