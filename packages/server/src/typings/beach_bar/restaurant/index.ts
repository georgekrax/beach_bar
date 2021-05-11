import { BeachBarRestaurant } from "entity/BeachBarRestaurant";
import { AddType, UpdateType } from "typings/.index";

type BeachBarRestaurantType = {
  restaurant: BeachBarRestaurant;
};

export type TAddBeachBarRestaurant = AddType & BeachBarRestaurantType;

export type TUpdateBeachBarRestaurant = UpdateType & BeachBarRestaurantType;
