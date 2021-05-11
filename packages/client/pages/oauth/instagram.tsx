import Auth from "@/components/Auth";
import { AUTH_ACTIONS } from "@/components/Auth/reducer";
import { LoginDialog } from "@/components/Layout/LoginDialog";
import OAuth from "@/components/OAuth";
import { useAuthorizeWithInstagramMutation } from "@/graphql/generated";
import { userIpAddr } from "@/lib/apollo/cache";
import { ApolloGraphQLErrors } from "@/typings/graphql";
import { LoginFormData } from "@/typings/user";
import { useAuthContext } from "@/utils/contexts";
import { emailSchema } from "@/utils/yup";
import { Input } from "@hashtag-design-system/components";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useController, useForm } from "react-hook-form";

type FormData = Pick<LoginFormData, "email">;

const InstagramCallback: React.FC = () => {
  const [graphqlErrors, setGraphqlErrors] = useState<ApolloGraphQLErrors>([]);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(emailSchema) });
  const { field: email } = useController<FormData, "email">({ name: "email", control });

  const router = useRouter();
  const [authorizeWithInstagram] = useAuthorizeWithInstagramMutation();
  const { dispatch } = useAuthContext();

  const authorize = async ({ email }: FormData) => {
    const { code, state } = router.query;
    dispatch({ type: AUTH_ACTIONS.TOGGLE_LOGIN_DIALOG, payload: { bool: false } });
    const { errors: mutationErrors } = await authorizeWithInstagram({
      variables: {
        code: code as string,
        state: state as string,
        email,
        isPrimaryOwner: false,
        loginDetails: { city: userIpAddr().city, countryAlpha2Code: userIpAddr().countryCode },
      },
    });
    if (mutationErrors) setGraphqlErrors(mutationErrors);
    router.push("/");
  };

  useEffect(() => {
    dispatch({ type: AUTH_ACTIONS.TOGGLE_LOGIN_DIALOG, payload: { bool: true } });
  }, []);

  // if (
  //   typeof window !== "undefined" &&
  //   process.env.NODE_ENV !== "production" &&
  //   window.location.href.includes("127.0.0.1")
  // )
  //   router.replace(window.location.href.replace("127.0.0.1:3000", "localhost:3000"));

  return (
    <OAuth.Redirect provider="Instagram" errors={graphqlErrors}>
      <LoginDialog oauth={false} dialogBtn={false}>
        <Auth.Container
          initial={false}
          controls={false}
          variants={false}
          description="Let us know your email, in order to login"
          other={false}
          handleClick={false}
          children={
            <Auth.Container.FormGroup onSubmit={handleSubmit(authorize)}>
              <Input
                {...email}
                placeholder="Email"
                forwardref={email.ref}
                secondhelptext={{ error: true, value: errors.email?.message }}
              />
              <Auth.CTA btn="Login" errors={graphqlErrors} />
            </Auth.Container.FormGroup>
          }
        />
      </LoginDialog>
    </OAuth.Redirect>
  );
};

InstagramCallback.displayName = "OAuthInstagramCallback";

export default InstagramCallback;
