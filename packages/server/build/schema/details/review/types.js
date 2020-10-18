"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewVisitType = void 0;
const schema_1 = require("@nexus/schema");
exports.ReviewVisitType = schema_1.objectType({
    name: "ReviewVisitType",
    description: "Represents a review's visit type, by the user",
    definition(t) {
        t.int("id", { nullable: false });
        t.string("name", { nullable: false, description: "The name of the particular visit type" });
    },
});
//# sourceMappingURL=types.js.map