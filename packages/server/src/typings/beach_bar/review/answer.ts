import { ReviewAnswer } from "@entity/ReviewAnswer";
import { AddType, UpdateType, ErrorType } from "@typings/.index";

type ReviewAnswerType = {
  answer: ReviewAnswer;
};

export type AddReviewAnswerType = (AddType & ReviewAnswerType) | ErrorType;

export type UpdateReviewAnswerType = (UpdateType & ReviewAnswerType) | ErrorType;