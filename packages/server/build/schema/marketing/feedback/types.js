"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoteTagType = exports.VoteCategoryType = void 0;
const nexus_1 = require("nexus");
exports.VoteCategoryType = nexus_1.objectType({
    name: "VoteCategory",
    description: "Represents a voting category",
    definition(t) {
        t.id("id");
        t.string("title");
        t.string("description");
        t.string("refCode");
    },
});
exports.VoteTagType = nexus_1.objectType({
    name: "VoteTag",
    description: "Represents the votes (voting result) of a voting category",
    definition(t) {
        t.id("id");
        t.int("upvotes");
        t.int("downvotes");
        t.nullable.int("totalVotes");
        t.field("category", {
            type: exports.VoteCategoryType,
            description: "The voting category these vote results are assigned to",
            resolve: o => o.category,
        });
    },
});
