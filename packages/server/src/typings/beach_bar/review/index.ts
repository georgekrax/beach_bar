import { BeachBarReview } from "@entity/BeachBarReview";
import { AddType, ErrorType, UpdateType } from "@typings/.index";
import { Customer } from "@entity/Customer";
import { Payment } from "@entity/Payment";

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
