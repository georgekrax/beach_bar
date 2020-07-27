import { BeachBarRestaurant } from "@entity/BeachBarRestaurant";
import { ErrorType, AddType, UpdateType } from "@typings/.index";

type BeachBarRestaurantType = {
  restaurant: BeachBarRestaurant;
};

export type AddBeachBarRestaurantType = (AddType & BeachBarRestaurantType) | ErrorType;

export type UpdateBeachBarRestaurantType = (UpdateType & BeachBarRestaurantType) | ErrorType;