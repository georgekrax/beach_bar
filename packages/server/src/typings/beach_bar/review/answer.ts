import { ReviewAnswer } from "entity/ReviewAnswer";
import { AddType, UpdateType } from "typings/.index";

type ReviewAnswerType = {
  answer: ReviewAnswer;
};

export type TAddReviewAnswer = AddType & ReviewAnswerType;

export type TUpdateReviewAnswer = UpdateType & ReviewAnswerType;
