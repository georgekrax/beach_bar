import { ReviewAnswer } from "entity/ReviewAnswer";
import { AddType, ErrorType, UpdateType } from "typings/.index";

type ReviewAnswerType = {
  answer: ReviewAnswer;
};

export type AddReviewAnswerType = (AddType & ReviewAnswerType) | ErrorType;

export type UpdateReviewAnswerType = (UpdateType & ReviewAnswerType) | ErrorType;
