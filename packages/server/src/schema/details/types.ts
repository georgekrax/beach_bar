import { objectType } from "@nexus/schema";

export const BeachBarCategoryType = objectType({
  name: "BeachBarCategory",
  description: "Represents a #beach_bar's category",
  definition(t) {
    t.id("id", { nullable: false });
    t.string("name", { nullable: false });
    t.string("description", { nullable: true });
  },
});

export const IconSizeType = objectType({
  name: "IconSize",
  description: "Represents an icon size (dimensions)",
  definition(t) {
    t.id("id", { nullable: false });
    t.int("value", { nullable: false, description: 'The size as an "Integer"' });
    t.string("formattedValue", { nullable: false, description: 'The formatted value of the icon size, in as a "String"' });
  },
});
