"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeachBarStyleType = void 0;
const nexus_1 = require("nexus");
exports.BeachBarStyleType = nexus_1.objectType({
    name: "BeachBarStyle",
    description: "The style of a #beach_bar",
    definition(t) {
        t.id("id");
        t.string("name");
    },
});
