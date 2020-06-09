import { objectType, unionType } from "@nexus/schema";

export const SuccessGraphQLType = objectType({
  name: "Success",
  description: "Info to be returned upon successful operation",
  definition(t) {
    t.boolean("success", { nullable: false, description: "A boolean that indicates if the operation was successful" });
  },
});

export const SuccessResult = unionType({
  name: "SuccessResult",
  definition(t) {
    t.members("Success", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "Success";
      }
    });
  },
});

export const DeleteGraphQLType = objectType({
  name: "Delete",
  description: "Info to be returned upon successful deletion",
  definition(t) {
    t.boolean("deleted", { nullable: false, description: "A boolean that indicates if the delete operation was successful" });
  },
});

export const DeleteResult = unionType({
  name: "DeleteResult",
  definition(t) {
    t.members("Delete", "Error");
    t.resolveType(item => {
      if (item.error) {
        return "Error";
      } else {
        return "Delete";
      }
    });
  },
});
