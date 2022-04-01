import { ApolloGraphQLErrors } from "@/typings/graphql";
import { Button } from "@hashtag-design-system/components";
import Feedback from "../Feedback";
import styles from "./CTA.module.scss";

export type Props = {
  btn: string;
  errors?: string | ApolloGraphQLErrors;
};

export const CTA: React.FC<Props> = ({ btn, errors, children }) => {
  return (
    <div className="w100 flex-column-center-center">
      {(typeof errors === "string" ? [errors] : errors)?.map((err, i) => (
        <Feedback.Error key={i}>{err}</Feedback.Error>
      ))}
      {children}
      <Button type="submit" className={styles.btn}>
        {btn}
      </Button>
    </div>
  );
};

CTA.displayName = "AuthCTA";
