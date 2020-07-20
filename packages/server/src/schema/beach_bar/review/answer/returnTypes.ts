import { ReviewAnswer } from "../../../../entity/ReviewAnswer";
import { AddType, UpdateType } from "../../../returnTypes";

type ReviewAnswerType = {
  answer: ReviewAnswer;
};

export type AddReviewAnswerType = AddType & ReviewAnswerType;

export type UpdateReviewAnswerType = UpdateType & ReviewAnswerType;
