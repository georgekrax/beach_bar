import { BeachBarReview } from "entity/BeachBarReview";
import { Customer } from "entity/Customer";
import { Payment } from "entity/Payment";
import { AddType, ErrorType, UpdateType } from "typings/.index";

type BeachBarReviewType = {
  review: BeachBarReview;
};

export type AddBeachBarReviewType = (AddType & BeachBarReviewType) | ErrorType;

export type UpdateBeachBarReviewType = (UpdateType & BeachBarReviewType) | ErrorType;

export interface VerifyUserPaymentReviewReturnResult {
  boolean: boolean;
  customer?: Customer;
  payment?: Payment;
}
