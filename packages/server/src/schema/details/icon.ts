<<<<<<< HEAD
import { objectType } from "nexus";

export const IconType = objectType({
  name: "Icon",
  description: "Represents a SVG icon to be used in the front-end",
  definition(t) {
    t.id("id");
    t.string("name");
    t.string("publicId", { description: "A unique public ID for the icon, to be matched in the front-end" });
  },
});
=======
import { objectType } from "nexus";

export const IconType = objectType({
  name: "Icon",
  description: "Represents a SVG icon to be used in the front-end",
  definition(t) {
    t.id("id");
    t.string("name");
    t.string("publicId", { description: "A unique public ID for the icon, to be matched in the front-end" });
  },
});
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
