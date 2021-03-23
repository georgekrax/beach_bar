"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeachBarCategoryType = void 0;
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
