import Auth from "@/components/Auth";
import { LoginDialog } from "@/components/Layout/LoginDialog";
import { useChangeUserPasswordMutation } from "@/graphql/generated";
import { SignUpFormData } from "@/typings/user";
import { useRouter } from "next/router";

const Token: React.FC = () => {
  const router = useRouter();
  const [changeUserPassword] = useChangeUserPasswordMutation();

  const handleSubmit = async ({ email, password }: Omit<SignUpFormData, "confirmPassword">) => {
    const { token } = router.query;
    const { data, errors } = await changeUserPassword({
      variables: { email, token: token as string, newPassword: password },
    });
    if (errors) return { errors };
    if (!errors && data?.changeUserPassword.success) router.push({ pathname: "/" });
  };

  return (
    <LoginDialog isShown oauth={false} dialogBtn={false}>
      <Auth.Container
        initial={false}
        controls={false}
        variants={false}
        description="Type your new password"
        other={false}
        handleClick={false}
        children={<Auth.SignUp forgotPassword btn="Reset password" handleFormSubmit={handleSubmit} />}
      />
    </LoginDialog>
  );
};

Token.displayName = "ForgotPasswordToken";

export default Token;
