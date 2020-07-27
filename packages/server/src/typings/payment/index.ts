import { Payment } from "@entity/Payment";
import { AddType, UpdateType, ErrorType } from "@typings/.index";
import { BeachBar } from "@entity/BeachBar";
import { RefundPercentage } from "@entity/RefundPercentage";

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

export type AddPaymentType =(AddType & PaymentType) | ErrorType;

export type UpdatePaymentType =(UpdateType & PaymentType) | ErrorType;
