import { UserFavoriteBar } from "entity/UserFavoriteBar";
import { AddType, ErrorType } from "typings/.index";

type UserFavoriteBarType = {
  favoriteBar: UserFavoriteBar;
};

export type AddUserFavoriteBarType = (AddType & UserFavoriteBarType) | ErrorType;
