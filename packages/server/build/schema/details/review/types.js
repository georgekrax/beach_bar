"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewVisitType = void 0;
const nexus_1 = require("nexus");
exports.ReviewVisitType = nexus_1.objectType({
    name: "ReviewVisitType",
    description: "Represents a review's visit type, by the user",
    definition(t) {
        t.id("id");
        t.string("name", { description: "The name of the particular visit type" });
    },
});
