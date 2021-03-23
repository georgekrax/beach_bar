import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import OAuth from "../../components/OAuth";
import { CONFIG } from "../../config";
import { useAuthorizeWithGoogleMutation } from "../../graphql/generated";
import { userIpAddr } from "../../lib/apollo/cache";
import { ApolloGraphQLErrors } from "../../typings/graphql";

type Props = {};

const GooggleCallback: React.FC<Props> = () => {
  const [graphqlErrors, setGraphqlErrors] = useState<ApolloGraphQLErrors>([]);
  const router = useRouter();
  const [authorizeWithGoogle] = useAuthorizeWithGoogleMutation();

  const authorize = async () => {
    const { code, state } = router.query;
    const { errors } = await authorizeWithGoogle({
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
      const localNetworkUrl = window.location.href.replace("127.0.0.1:3000", "192.168.1.4:3000");
      router.replace(localNetworkUrl);
    }
  }

  return <OAuth.Redirect provider="Google" errors={graphqlErrors} />;
};

GooggleCallback.displayName = "OAuthGooggleCallback";

export default GooggleCallback;
