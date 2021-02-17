import { objectType } from "nexus";

export const ReviewVisitType = objectType({
  name: "ReviewVisitType",
  description: "Represents a review's visit type, by the user",
  definition(t) {
    t.id("id");
    t.string("name", { description: "The name of the particular visit type" });
  },
});
