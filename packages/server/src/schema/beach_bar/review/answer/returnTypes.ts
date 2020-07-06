import { ReviewAnswer } from "../../../../entity/ReviewAnswer";
import { AddType, UpdateType } from "../../../returnTypes";

type ReviewAnswerType = {
  review: ReviewAnswer;
};

export type AddReviewAnswerType = AddType & ReviewAnswerType;

export type UpdateReviewAnswerType = UpdateType & ReviewAnswerType;
