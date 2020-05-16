import { queryType } from "@nexus/schema";

export const Query = queryType({
  description: "Query",
  definition(t) {
    t.string("hello", {
      resolve: () => {
        return `Hello world!`;
      },
    });
  },
});
