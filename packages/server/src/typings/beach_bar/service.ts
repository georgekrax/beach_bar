import { BeachBarFeature } from "entity/BeachBarFeature";
import { AddType, UpdateType } from "typings/.index";

export type BeachBarFeatureType = {
  feature: BeachBarFeature;
};

export type TAddBeachBarFeature = AddType & BeachBarFeatureType;

export type TUpdateBeachBarFeature = UpdateType & BeachBarFeatureType;
