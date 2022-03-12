import { objectType } from "nexus";
import { ReviewVisitType } from "nexus-prisma";

export const ReviewVisitGraphQLType = objectType({
  name: ReviewVisitType.$name,
  description: "Represents a review's visit type, by the user",
  definition(t) {
    // t.id("id");
    // t.string("name", { description: "The name of the particular visit type" });
    t.field(ReviewVisitType.id)
    t.field(ReviewVisitType.name)
  },
});
