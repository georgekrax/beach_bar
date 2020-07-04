import { BeachBarRestaurant } from "../../../entity/BeachBarRestaurant";
import { AddType, UpdateType } from "../../returnTypes";

type BeachBarRestaurantType = {
  restaurant: BeachBarRestaurant;
};

export type AddBeachBarRestaurantType = AddType & BeachBarRestaurantType;

export type UpdateBeachBarRestaurantType = UpdateType & BeachBarRestaurantType;
