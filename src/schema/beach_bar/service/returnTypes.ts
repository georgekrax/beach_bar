import { AddType } from "../../returnTypes";
import { BeachBarFeature } from "../../../entity/BeachBarFeature";

export type BeachBarFeatureType = {
  feature: BeachBarFeature;
};

export type AddBeachBarFeatureType = AddType & BeachBarFeatureType;
