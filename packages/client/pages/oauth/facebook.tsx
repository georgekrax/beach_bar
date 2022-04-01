import OAuth from "@/components/OAuth";
import { useAuthorizeWithFacebookMutation } from "@/graphql/generated";
import { userIpAddr } from "@/lib/apollo/cache";
import { ApolloGraphQLErrors } from "@/typings/graphql";
import { useReactiveVar } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type Props = {};

const FacebookCallback: React.FC<Props> = () => {
  const router = useRouter();
  const [graphqlErrors, setGraphqlErrors] = useState<ApolloGraphQLErrors>([]);

  const ipAddress = useReactiveVar(userIpAddr);
  const [authorizeWithFacebook] = useAuthorizeWithFacebookMutation();

  const authorize = async () => {
    const { code, state } = router.query;
    const { errors } = await authorizeWithFacebook({
      variables: {
        code: code as string,
        state: state as string,
        isPrimaryOwner: false,
        loginDetails: { city: ipAddress?.city, countryAlpha2Code: ipAddress?.countryCode },
      },
    });
    if (errors) setGraphqlErrors(errors);
    router.push("/");
  };

  useEffect(() => {
    if (router.query.code && router.query.state) authorize();
  }, [router.query]);

  if (typeof window !== "undefined") {
    if (process.env.NODE_ENV !== "production" && window.location.href.includes("192.168.1.8")) {
      const localNetworkUrl = window.location.href.replace("192.168.1.8:3000", "192.168.1.8:3000");
      router.replace(localNetworkUrl);
    }
  }

  return <OAuth.Redirect provider="Facebook" errors={graphqlErrors} />;
};

FacebookCallback.displayName = "OAuthFacebookCallback";

export default FacebookCallback;
