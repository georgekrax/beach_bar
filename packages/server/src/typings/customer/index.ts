import { Customer } from "entity/Customer";
import { AddType, UpdateType } from "typings/.index";

type CustomerType = {
  customer: Customer;
};

export type TAddCustomer = AddType & CustomerType;

export type TUpdateCustomer = UpdateType & CustomerType;
