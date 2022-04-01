import { UserLoginDetails } from "@/graphql/generated";
import { userIpAddr } from "@/lib/apollo/cache";
import { LoginFormData } from "@/typings/user";
import { useAuthContext } from "@/utils/contexts";
import { loginSchema } from "@/utils/yup";
import { useReactiveVar } from "@apollo/client";
import { Flex, Form, Input, Text } from "@hashtag-design-system/components";
import { yupResolver } from "@hookform/resolvers/yup";
import { signIn, SignInResponse } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CTA } from "./CTA";
import { AUTH_ACTIONS } from "./reducer";

type Props = {
  handleForgotPassword: () => void;
};

export const Login: React.FC<Props> = ({ handleForgotPassword }) => {
  const [graphqlErrors, setGraphqlErrors] = useState<SignInResponse["error"] | undefined>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: yupResolver(loginSchema) });

  const { dispatch } = useAuthContext();
  const ipAddress = useReactiveVar(userIpAddr);

  const onSubmit = async (data: LoginFormData) => {
    let loginDetails: UserLoginDetails | undefined = undefined;
    const res = (await signIn("credentials", { ...data, redirect: false })) as SignInResponse | undefined;
    if (!res || !res.ok || res.error) setGraphqlErrors(res?.error);
    else dispatch({ type: AUTH_ACTIONS.TOGGLE_LOGIN_DIALOG, payload: { bool: false } });
    // if (ipAddress) loginDetails = { city: ipAddress.city, countryAlpha2Code: ipAddress.countryCode };
    // const { data, errors } = await login({
    //   variables: { userCredentials: { email, password }, loginDetails },
    //   refetchQueries: [{ query: MeDocument }],
    // });
  };

  return (
    <Flex as="form" flexDirection="column" onSubmit={handleSubmit(onSubmit)}>
      <Form.Control isInvalid={!!errors.email}>
        <Input {...register("email")} placeholder="Email" />
        <Form.ErrorMessage>{errors.email?.message}</Form.ErrorMessage>
      </Form.Control>
      <div>
        <Form.Control isInvalid={!!errors.password}>
          <Input.Password {...register("password")} form="login" />
          <Form.ErrorMessage>{errors.password?.message}</Form.ErrorMessage>
        </Form.Control>
        <Text as="span" display="block" mt={1} className="body-14 link text--right" onClick={handleForgotPassword}>
          Forgot password?
        </Text>
      </div>
      <CTA btn="Login" errors={graphqlErrors} />
    </Flex>
  );
};

Login.displayName = "AuthLogin";
