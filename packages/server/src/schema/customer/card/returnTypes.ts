import { Card } from "../../../entity/Card";
import { AddType, UpdateType } from "../../returnTypes";

export type CardType = {
  card: Card;
}

export type AddCardType = AddType & CardType;

export type UpdateCardType = UpdateType & CardType;