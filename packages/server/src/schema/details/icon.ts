import { objectType } from "nexus";
import { Icon } from "nexus-prisma";

export const IconType = objectType({
  name: Icon.$name,
  description: "Represents a SVG icon to be used in the front-end",
  definition(t) {
    // t.id("id");
    // t.string("name");
    // t.string("publicId", { description: "A unique public ID for the icon, to be matched in the front-end" });
    t.field(Icon.id)
    t.field(Icon.name)
    t.field(Icon.publicId)
  },
});
