import { objectType } from "@nexus/schema";
import { UserType } from "../user/types";
import { CardType } from "./card/types";

export const CustomerType = objectType({
  name: "Customer",
  description: "Represents a customer",
  definition(t) {
    t.bigint("id", { nullable: false });
    t.email("email", { nullable: false });
    t.field("user", {
      type: UserType,
      description: "The user that is a customer too",
      nullable: true,
      resolve: o => o.user,
    });
    t.list.field("cards", {
      type: CardType,
      description: "A list of all the customers cards",
      nullable: true,
      resolve: o => o.cards,
    });
  },
});
