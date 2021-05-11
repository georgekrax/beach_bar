import { RestaurantFoodItem } from "entity/RestaurantFoodItem";
import { AddType, UpdateType } from "typings/.index";

type RestaurantFoodItemType = {
  foodItem: RestaurantFoodItem;
};

export type TAddRestaurantFoodItem = AddType & RestaurantFoodItemType;

export type TUpdateRestaurantFoodItem = UpdateType & RestaurantFoodItemType;
