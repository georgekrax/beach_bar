import { UserContactDetails } from "../../entity/UserContactDetails";
import { AddType, UpdateType } from "../returnTypes";

export type AddUserContactDetailsType = AddType & {
  contactDetails: UserContactDetails;
};

export type UpdateUserContactDetailsType = UpdateType & {
  contactDetails: UserContactDetails;
};
