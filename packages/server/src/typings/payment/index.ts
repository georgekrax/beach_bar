import { BeachBar } from "entity/BeachBar";
import { Payment } from "entity/Payment";
import { RefundPercentage } from "entity/RefundPercentage";
import { HourTime, MonthTime } from "entity/Time";
import { AddType, ErrorType, UpdateType } from "typings/.index";

export interface GetRefundPercentage {
  refundPercentage: RefundPercentage;
  daysDiff: number;
}

type PaymentType = {
  payment: Payment;
};

export type AddPaymentType = (AddType & PaymentType) | ErrorType;

export type UpdatePaymentType = (UpdateType & PaymentType) | ErrorType;

export type TVisit = {
  time: Pick<HourTime, "id" | "value">;
  date: string;
  isUpcoming: boolean;
  isRefunded: boolean;
  payment: Payment;
};

export type TPaymentVisits = {
  beachBar: BeachBar;
  visits: TVisit[];
};

export type TPaymentVisitsDate = {
  month: Pick<MonthTime, "id" | "value" | "days">;
  year: number;
};
