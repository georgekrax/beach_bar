import { objectType } from "@nexus/schema";
import { UserType } from "../user/types";
import { BeachBarType } from "./types";

export const ReviewVisitType = objectType({
  name: "ReviewVisitType",
  description: "Represents a review's visit type, by the user",
  definition(t) {
    t.int("id", { nullable: false });
    t.string("name", { nullable: false, description: "The name of the particular visit type" });
  },
});

export const BeachBarReviewType = objectType({
  name: "BeachBarReview",
  description: "Represents a #beach_bar's review, by a signed up user",
  definition(t) {
    // @ts-ignore
    t.bigint("id", { nullable: false, description: "The ID value of the review" });
    t.int("ratingValue", { nullable: false, description: "The user's rating, between 0 and 10" });
    // @ts-ignore
    t.datetime("visitTime", { nullable: false, description: "The date when the user visited the reviewed #beach_bar" });
    t.int("upvotes", { nullable: true, description: "The time the paticular review was voted to be helpful, by other users" });
    t.int("downvotes", {
      nullable: true,
      description: "The time the paticular review was voted not to be helpful, by other users",
    });
    t.string("niceComment", { nullable: true, description: "A nice comment by the user for the reviewed #beach_bar" });
    t.string("badComment", { nullable: true, description: "A bad comment by the user for the reviewed #beach_bar" });
    // @ts-ignore
    t.datetime("updatedAt", {
      nullable: false,
      description: "The last time user's account was updated, in the format of a timestamp",
    });
    // @ts-ignore
    t.datetime("timestamp", {
      nullable: false,
      description: "The timestamp recorded, when the user's account was created",
    });
    t.field("beachBar", {
      type: BeachBarType,
      description: "The #beach_bar of the review",
      nullable: false,
      resolve: o => o.beachBar,
    });
    t.field("user", {
      type: UserType,
      description: "The user submitted the particular review for a #beach_bar",
      nullable: false,
      resolve: o => o.user,
    });
    t.field("visitType", {
      type: ReviewVisitType,
      nullable: true,
      description: "The type of visit for the user",
      resolve: o => o.visitType,
    });
  },
});

export const ReviewAnswerType = objectType({
  name: "ReviewAnswer",
  description: "Represents an answer for a review of a #beach_bar, by the owner",
  definition(t) {
    // @ts-ignore
    t.bigint("id", { nullable: false, description: "The ID value of the particular review answer" });
    t.string("body", {
      nullable: false,
      description: "The body (content) of the review answer, written by the reviewed #beach_bar's owner",
    });
    t.field("review", {
      type: BeachBarReviewType,
      description: "The review this answer is assigned to",
      nullable: false,
      resolve: o => o.review,
    });
  },
});
