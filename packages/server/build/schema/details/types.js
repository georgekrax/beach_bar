"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IconSizeType = exports.BeachBarCategoryType = void 0;
const nexus_1 = require("nexus");
exports.BeachBarCategoryType = nexus_1.objectType({
    name: "BeachBarCategory",
    description: "Represents a #beach_bar's category",
    definition(t) {
        t.id("id");
        t.string("name");
        t.nullable.string("description");
    },
});
exports.IconSizeType = nexus_1.objectType({
    name: "IconSize",
    description: "Represents an icon size (dimensions)",
    definition(t) {
        t.id("id");
        t.int("value", { description: 'The size as an "Integer"' });
        t.string("formattedValue", { description: 'The formatted value of the icon size, in as a "String"' });
    },
});
