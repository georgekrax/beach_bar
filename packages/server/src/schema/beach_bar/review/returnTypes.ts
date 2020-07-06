import { BeachBarReview } from "../../../entity/BeachBarReview";
import { AddType, UpdateType } from "../../returnTypes";

type BeachBarReviewType = {
  review: BeachBarReview;
};

export type AddBeachBarReviewType = AddType & BeachBarReviewType;

export type UpdateBeachBarReviewType = UpdateType & BeachBarReviewType;
