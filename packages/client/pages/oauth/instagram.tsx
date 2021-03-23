import { Input } from "@hashtag-design-system/components";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import AuthForm from "../../components/AuthForm";
import Layout from "../../components/Layout";
import OAuth from "../../components/OAuth";
import { useAuthorizeWithInstagramMutation } from "../../graphql/generated";
import { userIpAddr } from "../../lib/apollo/cache";
import { ApolloGraphQLErrors } from "../../typings/graphql";
import { LoginFormData } from "../../typings/user";
import { emailSchema } from "../../utils/yup";

type FormData = Pick<LoginFormData, "email">;

const InstagramCallback: React.FC = () => {
  const [isDialogShown, setIsDialogShown] = useState(true);
  const [graphqlErrors, setGraphqlErrors] = useState<ApolloGraphQLErrors>([]);
  const { register, handleSubmit, errors } = useForm<FormData>({
    resolver: yupResolver(emailSchema),
  });
  const router = useRouter();
  const [authorizeWithInstagram] = useAuthorizeWithInstagramMutation();

  const authorize = async ({ email }: FormData) => {
    const { code, state } = router.query;
    setIsDialogShown(false);
    const { data, errors: mutationErrors } = await authorizeWithInstagram({
      variables: {
        code: code as string,
        state: state as string,
        email,
        isPrimaryOwner: false,
        loginDetails: {
          city: userIpAddr().city,
          countryAlpha2Code: userIpAddr().countryCode,
        },
      },
    });
    if (mutationErrors) setGraphqlErrors(mutationErrors);
    router.push("/");
  };

  // if (
  //   typeof window !== "undefined" &&
  //   process.env.NODE_ENV !== "production" &&
  //   window.location.href.includes("127.0.0.1")
  // )
  //   router.replace(window.location.href.replace("127.0.0.1:3000", "192.168.1.4:3000"));

  return (
    <OAuth.Redirect provider="Instagram" errors={graphqlErrors}>
      <Layout.LoginDialog isShown={isDialogShown} oauth={false} dialogBtn={false} setIsShown={() => {}}>
        <AuthForm.Container
          initial={false}
          controls={false}
          variants={false}
          description="Let us know your email, in order to login"
          other={false}
          handleClick={false}
          children={
            <AuthForm.Container.FormGroup onSubmit={handleSubmit(authorize)}>
              <Input
                placeholder="Email"
                name="email"
                forwardref={register}
                secondhelptext={{ error: true, value: errors.email?.message }}
              />
              <AuthForm.CTA btn="Login" errors={graphqlErrors} />
            </AuthForm.Container.FormGroup>
          }
        />
      </Layout.LoginDialog>
    </OAuth.Redirect>
  );
};

InstagramCallback.displayName = "OAuthInstagramCallback";

export default InstagramCallback;
