import { objectType } from "@nexus/schema";

export const BeachBarCategoryType = objectType({
  name: "BeachBarCategory",
  description: "Represents a #beach_bar's category",
  definition(t) {
    t.int("id", { nullable: false });
    t.string("name", { nullable: false });
    t.string("description", { nullable: true });
  },
});
