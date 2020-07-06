import { Payment } from "../../entity/Payment";
import { AddType, UpdateType } from "../returnTypes";

type PaymentType = {
  payments: Payment[];
};

export type AddPaymentType = AddType & PaymentType;

export type UpdatePaymentType = UpdateType & PaymentType;
