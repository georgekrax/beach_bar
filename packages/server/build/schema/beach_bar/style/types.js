"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeachBarStyleType = void 0;
const schema_1 = require("@nexus/schema");
exports.BeachBarStyleType = schema_1.objectType({
    name: "BeachBarStyle",
    description: "The style of a #beach_bar",
    definition(t) {
        t.id("id", { nullable: false });
        t.string("name", { nullable: false });
    },
});
//# sourceMappingURL=types.js.map