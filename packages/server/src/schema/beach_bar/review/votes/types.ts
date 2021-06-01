import { DateTimeScalar } from "@the_hashtag/common/dist/graphql";
import { objectType } from "nexus";
import { UserType } from "schema/user/types";
import { BeachBarReviewType } from "../types";

export const ReviewVoteTypeGraphQL = objectType({
  name: "ReviewVoteType",
  description: "Represents a vote for a user's review",
  definition(t) {
    t.id("id", { description: "The ID value of the vote type" });
    t.string("value", { description: "The type value of the vote" });
  },
});

export const ReviewVoteType = objectType({
  name: "ReviewVote",
  description: "Represents a vote for a user's review",
  definition(t) {
    t.id("id", { description: "The ID value of the vote" });
    t.field("review", { type: BeachBarReviewType, description: "The review of where the vote is added" });
    t.field("user", { type: UserType, description: "The user that added the vote" });
    t.field("type", { type: ReviewVoteTypeGraphQL, description: "The type of the vote" });
    t.field("updatedAt", {
      type: DateTimeScalar,
      description: "The last time the vote was updated, in the format of a timestamp",
    });
    t.field("timestamp", {
      type: DateTimeScalar,
      description: "The timestamp recorded, when the vote was created",
    });
  },
});
