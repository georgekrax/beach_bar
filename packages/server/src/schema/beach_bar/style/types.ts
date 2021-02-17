import { objectType } from "nexus";

export const BeachBarStyleType = objectType({
  name: "BeachBarStyle",
  description: "The style of a #beach_bar",
  definition(t) {
    t.id("id");
    t.string("name");
  },
});
