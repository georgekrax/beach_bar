import { queryType } from "@nexus/schema";
import { MyContext } from "../common/myContext";

export const Query = queryType({
  description: "Query",
  definition(t) {
    t.string("hello", {
      resolve: (_, __, { payload }: MyContext) => {
        if (payload) {
          return `Hello world, ${payload.sub}!`;
        }
        return "Hello world!";
      },
    });
  },
});
