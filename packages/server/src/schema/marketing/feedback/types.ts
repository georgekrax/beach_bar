import { objectType } from "nexus";

export const VoteCategoryType = objectType({
  name: "VoteCategory",
  description: "Represents a voting category",
  definition(t) {
    t.id("id");
    t.string("title");
    t.string("description");
    t.string("refCode");
  },
});

export const VoteTagType = objectType({
  name: "VoteTag",
  description: "Represents the votes (voting result) of a voting category",
  definition(t) {
    t.id("id");
    t.int("upvotes");
    t.int("downvotes");
    t.nullable.int("totalVotes");
    t.field("category", {
      type: VoteCategoryType,
      description: "The voting category these vote results are assigned to",
      resolve: o => o.category,
    });
  },
});
