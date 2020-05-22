import { interfaceType } from "@nexus/schema";

export const ErrorInterface = interfaceType({
  name: "ErrorInterface",
  description: "Adds error functionality",
  definition(t) {
    t.string("error", { nullable: true, description: "Returns an error, with a type of string, if there is one" });
    t.resolveType(() => null);
  },
});
