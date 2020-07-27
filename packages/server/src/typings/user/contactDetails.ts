import { UserContactDetails } from "@entity/UserContactDetails";
import { AddType, ErrorType, UpdateType } from "@typings/.index";

type UserContactDetailsType = {
  contactDetails: UserContactDetails;
};

export type AddUserContactDetailsType = (AddType & UserContactDetailsType) | ErrorType;

export type UpdateUserContactDetailsType = (UpdateType & UserContactDetailsType) | ErrorType;
