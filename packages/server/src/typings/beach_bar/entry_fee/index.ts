import { BeachBarEntryFee } from "entity/BeachBarEntryFee";
import { AddType, ErrorType, UpdateType } from "typings/.index";

type BeachBarEntryFeeType = {
  fees: BeachBarEntryFee[];
};

export type AddBeachBarEntryFeeType = (AddType & BeachBarEntryFeeType) | ErrorType;

export type UpdateBeachBarEntryFeeType = (UpdateType & BeachBarEntryFeeType) | ErrorType;
