import { BeachBar } from "../../entity/BeachBar";
import { User } from "../../entity/User";
import { AddType } from "../returnTypes";

export type AddBeachBarOwnerType = AddType & {
  beachBar: BeachBar;
  user: User;
  isPrimary: boolean;
};
