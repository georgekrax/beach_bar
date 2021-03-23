import { BeachBarReview } from "entity/BeachBarReview";
import { Customer } from "entity/Customer";
import { Payment } from "entity/Payment";
import { AddType, UpdateType } from "typings/.index";

type BeachBarReviewType = {
  review: BeachBarReview;
};

export type TAddBeachBarReview = AddType & BeachBarReviewType;

export type TUpdateBeachBarReview = UpdateType & BeachBarReviewType;

export interface VerifyUserPaymentReviewReturnResult {
  boolean: boolean;
  customer?: Customer;
  payment?: Payment;
}
