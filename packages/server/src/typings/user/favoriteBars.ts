import { UserFavoriteBar } from "entity/UserFavoriteBar";
import { UpdateType } from "typings/.index";

type UserFavoriteBarType = {
  favouriteBar: UserFavoriteBar;
};

export type TUpdateUserFavoriteBarType = UpdateType & UserFavoriteBarType;
