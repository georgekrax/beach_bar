"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoteTagType = exports.VoteCategoryType = void 0;
const schema_1 = require("@nexus/schema");
exports.VoteCategoryType = schema_1.objectType({
    name: "VoteCategory",
    description: "Represents a voting category",
    definition(t) {
        t.int("id", { nullable: false });
        t.string("title", { nullable: false });
        t.string("description", { nullable: false });
        t.string("refCode", { nullable: false });
    },
});
exports.VoteTagType = schema_1.objectType({
    name: "VoteTag",
    description: "Represents the votes (voting result) of a voting category",
    definition(t) {
        t.int("id", { nullable: false });
        t.int("upvotes", { nullable: false });
        t.int("downvotes", { nullable: false });
        t.int("totalVotes", { nullable: true });
        t.field("category", {
            type: exports.VoteCategoryType,
            description: "The voting category these vote results are assigned to",
            nullable: false,
            resolve: o => o.category,
        });
    },
});
//# sourceMappingURL=types.js.map