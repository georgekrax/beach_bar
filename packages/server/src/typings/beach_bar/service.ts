import { BeachBarFeature } from "@entity/BeachBarFeature";
import { AddType, UpdateType, ErrorType } from "@typings/.index";

export type BeachBarFeatureType = {
  feature: BeachBarFeature;
};

export type AddBeachBarFeatureType = (AddType & BeachBarFeatureType) | ErrorType;

export type UpdateBeachBarFeatureType = (UpdateType & BeachBarFeatureType) | ErrorType;
