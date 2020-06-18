import { BeachBarFeature } from "../../../entity/BeachBarFeature";
import { AddType } from "../../returnTypes";

export type BeachBarFeatureType = {
  feature: BeachBarFeature;
};

export type AddBeachBarFeatureType = AddType & BeachBarFeatureType;
