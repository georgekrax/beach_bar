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
