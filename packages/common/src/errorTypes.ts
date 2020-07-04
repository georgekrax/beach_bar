import { objectType } from "@nexus/schema";

export const ErrorObjectType = objectType({
  name: "ErrorObject",
  description: "Represents an error object",
  definition(t) {
    t.string("code", {
      nullable: true,
      description:
        "The error code of the operation, it can be found in a list in the documentation",
    });
    t.string("message", {
      nullable: false,
      description: "A short description for the error occurred",
    });
  },
});

export const Error = objectType({
  name: "Error",
  description: "Represents a formatted error",
  definition(t) {
    t.field("error", {
      type: ErrorObjectType,
      nullable: true,
      description:
        "Returns an error in a type of string, if there is one, with a status and a message",
    });
  },
});
