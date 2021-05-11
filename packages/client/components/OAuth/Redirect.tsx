<<<<<<< HEAD
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
    <Layout header={{ withAuth: false }} main={{ className: "ih100" }} tapbar={false}>
      <div className={styles.container + " w100 flex-column-center-center"}>
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
=======
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
    <Layout header={{ withAuth: false }} main={{ className: "ih100" }} tapbar={false}>
      <div className={styles.container + " w100 flex-column-center-center"}>
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
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
