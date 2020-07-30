import { BeachBar } from "@entity/BeachBar";
import { Payment } from "@entity/Payment";
import { RefundPercentage } from "@entity/RefundPercentage";
import { AddType, ErrorType, UpdateType } from "@typings/.index";

export type UniqueBeachBarsType = {
  beachBar: BeachBar;
  discountPercentage: number;
}[];

export interface GetRefundPercentage {
  refundPercentage: RefundPercentage;
  daysDiff: number;
}

type PaymentType = {
  payment: Payment;
};

export type AddPaymentType = (AddType & PaymentType) | ErrorType;

export type UpdatePaymentType = (UpdateType & PaymentType) | ErrorType;
