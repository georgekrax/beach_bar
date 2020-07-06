import { objectType } from "@nexus/schema";

export const ReviewVisitType = objectType({
  name: "ReviewVisitType",
  description: "Represents a review's visit type, by the user",
  definition(t) {
    t.int("id", { nullable: false });
    t.string("name", { nullable: false, description: "The name of the particular visit type" });
  },
});
