import { Customer } from "@entity/Customer";
import { AddType, ErrorType, UpdateType } from "@typings/.index";

type CustomerType = {
  customer: Customer;
};

export type AddCustomerType = (AddType & CustomerType) | ErrorType;

export type UpdateCustomerType = (UpdateType & CustomerType) | ErrorType;