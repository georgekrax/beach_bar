import { MeDocument, useLoginMutation, UserLoginDetails } from "@/graphql/generated";
import { userIpAddr } from "@/lib/apollo/cache";
import { ApolloGraphQLErrors } from "@/typings/graphql";
import { LoginFormData } from "@/typings/user";
import { useAuthContext } from "@/utils/contexts";
import { loginSchema } from "@/utils/yup";
import { Input } from "@hashtag-design-system/components";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useController, useForm } from "react-hook-form";
import { FormGroup } from "./Container";
import { CTA } from "./CTA";
import { AUTH_ACTIONS } from "./reducer";

type Props = {
  handleForgotPasswordClick: () => Promise<void>;
};

export const Login: React.FC<Props> = ({ handleForgotPasswordClick }) => {
  const [graphqlErrors, setGraphqlErrors] = useState<ApolloGraphQLErrors>([]);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: yupResolver(loginSchema) });
  const { field: email } = useController<LoginFormData, "email">({ name: "email", control });
  const { field: password } = useController<LoginFormData, "password">({ name: "password", control });

  const [login] = useLoginMutation();
  const { dispatch } = useAuthContext();

  const onSubmit = async ({ email, password }: LoginFormData) => {
    let loginDetails: UserLoginDetails | undefined = undefined;
    if (userIpAddr()) loginDetails = { city: userIpAddr().city, countryAlpha2Code: userIpAddr().countryCode };
    const { errors } = await login({
      variables: { userCredentials: { email, password }, loginDetails },
      refetchQueries: [{ query: MeDocument }],
    });
    if (errors) setGraphqlErrors(errors);
    else dispatch({ type: AUTH_ACTIONS.TOGGLE_LOGIN_DIALOG, payload: { bool: false } });
  };

  return (
    <FormGroup onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...email}
        placeholder="Email"
        forwardref={email.ref}
        secondhelptext={{ error: true, value: errors.email?.message }}
      />
      <Input
        {...password}
        placeholder="Password"
        type="password"
        forwardref={password.ref}
        secondhelptext={{ error: true, value: errors.password?.message }}
      />
      <span className="auth-form__forgot-password body-14 link" onClick={handleForgotPasswordClick}>
        Forgot password?
      </span>
      <CTA btn="Login" errors={graphqlErrors} />
    </FormGroup>
  );
};

Login.displayName = "AuthLogin";
