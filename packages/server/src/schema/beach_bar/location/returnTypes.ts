import { BeachBarLocation } from "../../../entity/BeachBarLocation";
import { AddType, UpdateType } from "../../returnTypes";

type BeachBarLocationType = {
  location: BeachBarLocation;
};

export type AddBeachBarLocationType = AddType & BeachBarLocationType;

export type UpdateBeachBarLocationType = UpdateType & BeachBarLocationType;
