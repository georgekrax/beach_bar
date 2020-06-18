import { BeachBarOwner } from "../../entity/BeachBarOwner";
import { AddType, UpdateType } from "../returnTypes";

export type BeachBarOwnerType = {
  owner: BeachBarOwner;
};

export type AddBeachBarOwnerType = AddType & BeachBarOwnerType;

export type UpdateBeachBarOwnerType = UpdateType & BeachBarOwnerType;
