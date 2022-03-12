import { resolve } from "@/utils/data";
import { objectType } from "nexus";
import { ReviewVote, ReviewVoteType as PrismaReviewVoteType } from "nexus-prisma";

export const ReviewVoteTypeGraphQL = objectType({
  name: PrismaReviewVoteType.$name,
  description: "Represents a vote for a user's review",
  definition(t) {
    // t.id("id", { description: "The ID value of the vote type" });
    // t.string("value", { description: "The type value of the vote" });
    t.field(PrismaReviewVoteType.id);
    t.field(PrismaReviewVoteType.value);
  },
});

export const ReviewVoteType = objectType({
  name: ReviewVote.$name,
  description: "Represents a vote for a user's review",
  definition(t) {
    // t.id("id", { description: "The ID value of the vote" });
    // t.field("review", { type: BeachBarReviewType, description: "The review of where the vote is added" });
    // t.field("user", { type: UserType, description: "The user that added the vote" });
    // t.field("type", { type: ReviewVoteTypeGraphQL, description: "The type of the vote" });
    // t.field("updatedAt", {
    //   type: DateTime.name,
    //   description: "The last time the vote was updated, in the format of a timestamp",
    // });
    // t.field("timestamp", {
    //   type: DateTime.name,
    //   description: "The timestamp recorded, when the vote was created",
    // });
    t.field(ReviewVote.id);
    t.field(resolve(ReviewVote.review));
    t.field(resolve(ReviewVote.user));
    t.field(resolve(ReviewVote.type));
    t.field(ReviewVote.timestamp);
    t.field(ReviewVote.updatedAt);
  },
});
