import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import OAuth from "../../components/OAuth";
import { useAuthorizeWithFacebookMutation } from "../../graphql/generated";
import { userIpAddr } from "../../lib/apollo/cache";
import { ApolloGraphQLErrors } from "../../typings/graphql";

type Props = {};

const FacebookCallback: React.FC<Props> = () => {
  const [graphqlErrors, setGraphqlErrors] = useState<ApolloGraphQLErrors>([]);
  const router = useRouter();
  const [authorizeWithFacebook] = useAuthorizeWithFacebookMutation();

  const authorize = async () => {
    const { code, state } = router.query;
    const { errors } = await authorizeWithFacebook({
      variables: {
        code: code as string,
        state: state as string,
        isPrimaryOwner: false,
        loginDetails: {
          city: userIpAddr().city,
          countryAlpha2Code: userIpAddr().countryCode,
        },
      },
    });
    if (errors) setGraphqlErrors(errors);
    router.push("/");
  };

  useEffect(() => {
    if (router.query.code && router.query.state) {
      authorize();
    }
  }, [router.query]);

  if (typeof window !== "undefined") {
    if (process.env.NODE_ENV !== "production" && window.location.href.includes("127.0.0.1")) {
      const localNetworkUrl = window.location.href.replace("127.0.0.1:3000", "localhost:3000");
      router.replace(localNetworkUrl);
    }
  }

  return <OAuth.Redirect provider="Facebook" errors={graphqlErrors} />;
};

FacebookCallback.displayName = "OAuthFacebookCallback";

export default FacebookCallback;
