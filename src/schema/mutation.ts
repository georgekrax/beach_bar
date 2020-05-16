import { mutationType, stringArg } from "@nexus/schema";

export const Mutation = mutationType({
  description: "Mutation",
  definition(t) {
    t.string("hello", {
      description: "Sample mutation",
      args: {
        name: stringArg({ nullable: true }),
      },
      resolve: (_, { name }) => {
        if (name) {
          return `Hello ${name}!`;
        } else {
          return "Hello world!";
        }
      },
    });
  },
});
