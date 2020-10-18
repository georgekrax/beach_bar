import { BeachBarImgUrl } from "entity/BeachBarImgUrl";
import { AddType, ErrorType, UpdateType } from "typings/.index";

type BeachBarImgUrlType = {
  imgUrl: BeachBarImgUrl;
};

export type AddBeachBarImgUrlType = (AddType & BeachBarImgUrlType) | ErrorType;

export type UpdateBeachBarImgUrlType = (UpdateType & BeachBarImgUrlType) | ErrorType;
