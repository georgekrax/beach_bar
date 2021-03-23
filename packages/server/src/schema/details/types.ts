import { objectType } from "nexus";

export const BeachBarCategoryType = objectType({
  name: "BeachBarCategory",
  description: "Represents a #beach_bar's category",
  definition(t) {
    t.id("id");
    t.string("name");
    t.nullable.string("description");
  },
});
