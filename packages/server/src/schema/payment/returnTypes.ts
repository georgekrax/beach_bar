import { Payment } from "../../entity/Payment";
import { AddType, UpdateType } from "../returnTypes";

type PaymentType = {
  payment: Payment;
};

export type AddPaymentType = AddType & PaymentType;

export type UpdatePaymentType = UpdateType & PaymentType;
