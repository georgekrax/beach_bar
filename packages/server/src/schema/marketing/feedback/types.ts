import { objectType } from "@nexus/schema";

export const VoteCategoryType = objectType({
  name: "VoteCategory",
  description: "Represents a voting category",
  definition(t) {
    t.int("id", { nullable: false });
    t.string("title", { nullable: false });
    t.string("description", { nullable: false });
    t.string("refCode", { nullable: false });
  },
});

export const VoteTagType = objectType({
  name: "VoteTag",
  description: "Represents the votes (voting result) of a voting category",
  definition(t) {
    t.int("id", { nullable: false });
    t.int("upvotes", { nullable: false });
    t.int("downvotes", { nullable: false });
    t.int("totalVotes", { nullable: true });
    t.field("category", {
      type: VoteCategoryType,
      description: "The voting category these vote results are assigned to",
      nullable: false,
      resolve: o => o.category,
    });
  },
});
