import { ApolloGraphQLErrors } from "@/typings/graphql";
import { OAuthProvider } from "@/typings/user";
import Feedback from "../Feedback";
import Icons from "../Icons";
import Layout from "../Layout";
import styles from "./Redirect.module.scss";

type Props = {
  provider: OAuthProvider;
  errors?: ApolloGraphQLErrors;
};

export const Redirect: React.FC<Props> = ({ provider, errors, children }) => {
  return (
    <Layout header={{ withAuth: false }} mainProps={{ className: "ih-100" }} tapbar={false}>
      <div className={styles.container + " w-100 flex-column-center-center"}>
        <Icons.Flame.Filled width={98} height={98} />
        <div>
          {errors?.length === 0 && (
            <span>
              <Feedback.Success semibold>Success!</Feedback.Success> Redirecting from {provider}...
            </span>
          )}
          {errors?.map(({ message }) => (
            <Feedback.Error key={message} semibold>
              {message}
            </Feedback.Error>
          ))}
        </div>
      </div>
      {children}
    </Layout>
  );
};

Redirect.displayName = "OAuthRedirect";
