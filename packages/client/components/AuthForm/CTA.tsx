import { ApolloGraphQLErrors } from "../../typings/graphql";
import Feedback from "../Feedback";
import { Button } from "@hashtag-design-system/components";

export type Props = {
  btn: string;
  errors?: ApolloGraphQLErrors;
};

export const CTA: React.FC<Props> = ({ btn, errors, children }) => {
  return (
    <div className="w-100 flex-column-center-center">
      {errors?.map(({ message }) => (
        <Feedback.Error key={message}>
          {message}
        </Feedback.Error>
      ))}
        {children}
      <Button type="submit" className="auth-form__cta">
        {btn}
      </Button>
    </div>
  );
};

CTA.displayName = "AuthFormCTA";
