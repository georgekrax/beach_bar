import { BeachBarLocation } from "entity/BeachBarLocation";
import { AddType, UpdateType } from "typings/.index";

type BeachBarLocationType = {
  location: BeachBarLocation;
};

export type TAddBeachBarLocation = AddType & BeachBarLocationType;

export type TUpdateBeachBarLocation = UpdateType & BeachBarLocationType;
