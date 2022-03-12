import { Payment } from "@/entity/Payment";
import { HourTime } from "@/entity/Time";
import { AddType, UpdateType } from "@/typings/index";

export type TPayment = {
  payment: Payment;
};

export type AddPaymentType = AddType & TPayment;

export type UpdatePaymentType = UpdateType & TPayment;

export type TVisit = {
  startTime: Pick<HourTime, "id" | "value">;
  endTime: TVisit["startTime"];
  date: string;
  isUpcoming: boolean;
  isRefunded: boolean;
  payment: Payment;
};

// @deprecated
// export type TPaymentVisits = {
//   beachBar: BeachBar;
//   visits: TVisit[];
// };

// @unused
// export type TPaymentVisitsDate = {
//   month: Pick<MonthTime, "id" | "value" | "days">;
//   year: number;
// };
