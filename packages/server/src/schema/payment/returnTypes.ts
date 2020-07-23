import { Payment } from "../../entity/Payment";
import { AddType, UpdateType } from "../returnTypes";
import { BeachBar } from "../../entity/BeachBar";

type PaymentType = {
  payment: Payment;
};

export type AddPaymentType = AddType & PaymentType;

export type UpdatePaymentType = UpdateType & PaymentType;

export type UniqueBeachBarsType = {
  beachBar: BeachBar;
  discountPercentage: number;
}[];
