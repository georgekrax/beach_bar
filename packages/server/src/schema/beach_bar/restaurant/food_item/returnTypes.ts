import { RestaurantFoodItem } from "../../../../entity/RestaurantFoodItem";
import { AddType, UpdateType } from "../../../returnTypes";

type RestaurantFoodItemType = {
  foodItem: RestaurantFoodItem;
};

export type AddRestaurantFoodItemType = AddType & RestaurantFoodItemType;

export type UpdateRestaurantFoodItemType = UpdateType & RestaurantFoodItemType;
