import { Card } from "entity/Card";
import { AddType, UpdateType } from "typings/.index";

type CardType = {
  card: Card;
};

export type TAddCard = AddType & CardType;

export type TUpdateCard = UpdateType & CardType;
