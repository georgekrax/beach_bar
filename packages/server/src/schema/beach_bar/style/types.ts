import { objectType } from "@nexus/schema";

export const BeachBarStyleType = objectType({
  name: "BeachBarStyle",
  description: "The style of a #beach_bar",
  definition(t) {
    t.id("id", { nullable: false });
    t.string("name", { nullable: false });
  },
});
