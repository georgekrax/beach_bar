import { BeachBarOwner } from "entity/BeachBarOwner";
import { AddType, UpdateType } from "typings/.index";

type BeachBarOwnerType = {
  owner: BeachBarOwner;
};

export type TAddBeachBarOwner = AddType & BeachBarOwnerType;

export type TUpdateBeachBarOwner = UpdateType & BeachBarOwnerType;
