import { BeachBarFeature } from "../../../entity/BeachBarFeature";
import { AddType, UpdateType } from "../../returnTypes";

export type BeachBarFeatureType = {
  feature: BeachBarFeature;
};

export type AddBeachBarFeatureType = AddType & BeachBarFeatureType;

export type UpdateBeachBarFeatureType = UpdateType & BeachBarFeatureType;
