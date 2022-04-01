import Auth from "@/components/Auth";
import { LoginDialog } from "@/components/Layout/LoginDialog";
import { useChangeUserPasswordMutation } from "@/graphql/generated";
import { SignUpFormData } from "@/typings/user";
import { useRouter } from "next/router";

const Token: React.FC = () => {
  const router = useRouter();
  const [changeUserPassword] = useChangeUserPasswordMutation();

  const handleSubmit = async ({ email, password }: Omit<SignUpFormData, "confirmPassword">) => {
    const { data, errors } = await changeUserPassword({
      variables: { email, newPassword: password, token: String(router.query.token) },
    });
    if (!data && errors) return { errors };
    if (data?.changeUserPassword) router.push({ pathname: "/" });
  };

  return (
    <LoginDialog isOpen hasOAuth={false} hasCloseBtn={false}>
      <Auth.Step description="Type your new password">
        <Auth.SignUp atForgotPassword btn="Reset password" handleFormSubmit={handleSubmit} />
      </Auth.Step>
    </LoginDialog>
  );
};

Token.displayName = "ForgotPasswordToken";

export default Token;
