import { BeachBarLocation } from "entity/BeachBarLocation";
import { AddType, ErrorType, UpdateType } from "typings/.index";

type BeachBarLocationType = {
  location: BeachBarLocation;
};

export type AddBeachBarLocationType = (AddType & BeachBarLocationType) | ErrorType;

export type UpdateBeachBarLocationType = (UpdateType & BeachBarLocationType) | ErrorType;
