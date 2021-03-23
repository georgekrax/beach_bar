import { useLoginMutation, UserLoginDetails } from "@/graphql/generated";
import { userIpAddr } from "@/lib/apollo/cache";
import { LoginFormData } from "@/typings/user";
import { ApolloGraphQLErrors } from "@/typings/graphql";
import { loginSchema } from "@/utils/yup";
import { Input } from "@hashtag-design-system/components";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import AuthForm from "./index";

type Props = {
  handleForgotPasswordClick: () => Promise<void>;
};

export const Login: React.FC<Props> = ({ handleForgotPasswordClick }) => {
  const [graphqlErrors, setGraphqlErrors] = useState<ApolloGraphQLErrors>([]);
  const { register, handleSubmit, errors } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });
  const [login] = useLoginMutation();

  const onSubmit = async ({ email, password }: LoginFormData) => {
    let loginDetails: UserLoginDetails | undefined = undefined;
    if (userIpAddr()) loginDetails = { city: userIpAddr().city, countryAlpha2Code: userIpAddr().countryCode };
    const { errors } = await login({ variables: { userCredentials: { email, password }, loginDetails } });
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
      <Input
        placeholder="Password"
        type="password"
        name="password"
        forwardref={register}
        secondhelptext={{ error: true, value: errors.password?.message }}
      />
      <span className="auth-form__forgot-password body-14 link" onClick={handleForgotPasswordClick}>
        Forgot password?
      </span>
      <AuthForm.CTA btn="Login" errors={graphqlErrors} />
    </AuthForm.Container.FormGroup>
  );
};

Login.displayName = "AuthFormLogin";
