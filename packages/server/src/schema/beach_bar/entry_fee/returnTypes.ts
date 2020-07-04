import { BeachBarEntryFee } from "../../../entity/BeachBarEntryFee";
import { AddType, UpdateType } from "../../returnTypes";

type BeachBarEntryFeeType = {
  fees: BeachBarEntryFee[];
};

export type AddBeachBarEntryFeeType = AddType & BeachBarEntryFeeType;

export type UpdateBeachBarEntryFeeType = UpdateType & BeachBarEntryFeeType;
