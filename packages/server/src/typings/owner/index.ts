import { BeachBarOwner } from "@entity/BeachBarOwner";
import { AddType, ErrorType, UpdateType } from "@typings/.index";

type BeachBarOwnerType = {
  owner: BeachBarOwner;
};

export type AddBeachBarOwnerType = (AddType & BeachBarOwnerType) | ErrorType;

export type UpdateBeachBarOwnerType = (UpdateType & BeachBarOwnerType) | ErrorType;