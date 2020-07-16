import { BeachBar } from "../../entity/BeachBar";
import { AddType, UpdateType } from "../returnTypes";

type BeachBarType = {
  beachBar: BeachBar;
};

export type AddBeachBarType = AddType & BeachBarType;

export type UpdateBeachBarType = UpdateType & BeachBarType;

export type BeachBarAvailabilityReturnType = {
  hasAvailability?: boolean;
  hasCapacity?: boolean;
};
