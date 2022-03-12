import { objectType } from "nexus";
import { BeachBarStyle } from "nexus-prisma";

export const BeachBarStyleType = objectType({
  name: BeachBarStyle.$name,
  description: "The style of a #beach_bar",
  definition(t) {
    t.field(BeachBarStyle.id);
    t.field(BeachBarStyle.name);
  },
});
