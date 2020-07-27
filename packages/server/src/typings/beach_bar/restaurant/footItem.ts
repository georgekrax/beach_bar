import { RestaurantFoodItem } from "@entity/RestaurantFoodItem";
import { ErrorType, AddType, UpdateType } from "@typings/.index";

type RestaurantFoodItemType = {
  foodItem: RestaurantFoodItem;
};

export type AddRestaurantFoodItemType = (AddType & RestaurantFoodItemType) | ErrorType;

export type UpdateRestaurantFoodItemType = (UpdateType & RestaurantFoodItemType) | ErrorType;