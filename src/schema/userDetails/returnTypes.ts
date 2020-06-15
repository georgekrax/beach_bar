import { UserContactDetails } from "../../entity/UserContactDetails";
import { AddType } from "../returnTypes";

export type AddAccountContactDetailsType = AddType & {
  contactDetails: UserContactDetails;
};
