<<<<<<< HEAD:packages/client/components/Auth/CTA.tsx
import { ApolloGraphQLErrors } from "@/typings/graphql";
import { Button } from "@hashtag-design-system/components";
import Feedback from "../Feedback";

export type Props = {
  btn: string;
  errors?: ApolloGraphQLErrors;
};

export const CTA: React.FC<Props> = ({ btn, errors, children }) => {
  return (
    <div className="w100 flex-column-center-center">
      {errors?.map(({ message }) => (
        <Feedback.Error key={message}>{message}</Feedback.Error>
      ))}
      {children}
      <Button type="submit" className="auth-form__cta">
        {btn}
      </Button>
    </div>
  );
};

CTA.displayName = "AuthCTA";
=======
import { ApolloGraphQLErrors } from "@/typings/graphql";
import { Button } from "@hashtag-design-system/components";
import Feedback from "../Feedback";

export type Props = {
  btn: string;
  errors?: ApolloGraphQLErrors;
};

export const CTA: React.FC<Props> = ({ btn, errors, children }) => {
  return (
    <div className="w100 flex-column-center-center">
      {errors?.map(({ message }) => (
        <Feedback.Error key={message}>{message}</Feedback.Error>
      ))}
      {children}
      <Button type="submit" className="auth-form__cta">
        {btn}
      </Button>
    </div>
  );
};

CTA.displayName = "AuthCTA";
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff:packages/client/components/AuthForm/CTA.tsx
