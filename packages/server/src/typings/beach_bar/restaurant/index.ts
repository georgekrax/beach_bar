import { BeachBarRestaurant } from "entity/BeachBarRestaurant";
import { AddType, ErrorType, UpdateType } from "typings/.index";

type BeachBarRestaurantType = {
  restaurant: BeachBarRestaurant;
};

export type AddBeachBarRestaurantType = (AddType & BeachBarRestaurantType) | ErrorType;

export type UpdateBeachBarRestaurantType = (UpdateType & BeachBarRestaurantType) | ErrorType;
