import { Card } from "entity/Card";
import { AddType, ErrorType, UpdateType } from "typings/.index";

type CardType = {
  card: Card;
};

export type AddCardType = (AddType & CardType) | ErrorType;

export type UpdateCardType = (UpdateType & CardType) | ErrorType;
