import { MyContext } from "@beach_bar/common";
import { queryType } from "nexus";

export const Query = queryType({
  description: "Query",
  definition(t) {
    t.string("hello", {
      resolve: (_, __, { payload }: MyContext) => {
        if (payload) {
          return `Hello world, ${payload.sub}!`;
        }
        // console.log("hey");
        return "Hello world!";
      },
    });
  },
});
