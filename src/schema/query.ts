import { queryType } from "@nexus/schema";

export const Query = queryType({
  description: "Query",
  definition(t) {
    t.string("hello", {
      resolve: (_, __, { payload }) => {
        console.log(payload);
        if (payload) {
          return `Hello world, ${payload.userId}!`;
        }
        return "Hello world!";
      },
    });
  },
});
