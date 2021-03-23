import { useRouter } from "next/router";
import AuthForm from "../../components/AuthForm";
import Layout from "../../components/Layout";
import { useChangeUserPasswordMutation } from "../../graphql/generated";
import { SignUpFormData } from "../../typings/user";

const Token: React.FC = () => {
  const router = useRouter();
  const [changeUserPassword] = useChangeUserPasswordMutation();

  const handleSubmit = async ({ email, password }: Omit<SignUpFormData, "confirmPassword">) => {
    const { token } = router.query;
    const { data, errors } = await changeUserPassword({
      variables: { email, token: token as string, newPassword: password },
    });
    if (errors) return { errors };
    if (!errors && data.changeUserPassword.success) router.push({ pathname: "/" });
  };

  return (
    <Layout.LoginDialog isShown oauth={false} dialogBtn={false} setIsShown={() => {}}>
      <AuthForm.Container
        initial={false}
        controls={false}
        variants={false}
        description="Type your new password"
        other={false}
        handleClick={false}
        children={<AuthForm.SignUp forgotPassword btn="Reset password" handleFormSubmit={handleSubmit} />}
      />
    </Layout.LoginDialog>
  );
};

Token.displayName = "ForgotPasswordToken";

export default Token;
