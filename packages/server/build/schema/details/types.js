"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IconSizeType = exports.BeachBarCategoryType = void 0;
const schema_1 = require("@nexus/schema");
exports.BeachBarCategoryType = schema_1.objectType({
    name: "BeachBarCategory",
    description: "Represents a #beach_bar's category",
    definition(t) {
        t.id("id", { nullable: false });
        t.string("name", { nullable: false });
        t.string("description", { nullable: true });
    },
});
exports.IconSizeType = schema_1.objectType({
    name: "IconSize",
    description: "Represents an icon size (dimensions)",
    definition(t) {
        t.id("id", { nullable: false });
        t.int("value", { nullable: false, description: 'The size as an "Integer"' });
        t.string("formattedValue", { nullable: false, description: 'The formatted value of the icon size, in as a "String"' });
    },
});
//# sourceMappingURL=types.js.map