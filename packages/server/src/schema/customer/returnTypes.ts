import { Customer } from "../../entity/Customer";
import { AddType, UpdateType } from "../returnTypes";

export type CustomerType = {
  customer: Customer;
};

export type AddCustomerType = AddType & CustomerType;

export type UpdateCustomerType = UpdateType & CustomerType;
