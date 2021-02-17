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

export const IconSizeType = objectType({
  name: "IconSize",
  description: "Represents an icon size (dimensions)",
  definition(t) {
    t.id("id");
    t.int("value", { description: 'The size as an "Integer"' });
    t.string("formattedValue", { description: 'The formatted value of the icon size, in as a "String"' });
  },
});
