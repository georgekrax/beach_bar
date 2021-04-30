import { BeachBarImgUrl } from "entity/BeachBarImgUrl";
import { AddType, UpdateType } from "typings/.index";

type BeachBarImgUrlType = {
  imgUrl: BeachBarImgUrl;
};

export type TAddBeachBarImgUrl = AddType & BeachBarImgUrlType;

export type TUpdateBeachBarImgUrl = UpdateType & BeachBarImgUrlType;
