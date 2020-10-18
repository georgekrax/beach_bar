import { BeachBarFeature } from "entity/BeachBarFeature";
import { AddType, ErrorType, UpdateType } from "typings/.index";

export type BeachBarFeatureType = {
  feature: BeachBarFeature;
};

export type AddBeachBarFeatureType = (AddType & BeachBarFeatureType) | ErrorType;

export type UpdateBeachBarFeatureType = (UpdateType & BeachBarFeatureType) | ErrorType;
