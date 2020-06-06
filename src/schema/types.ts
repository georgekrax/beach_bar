import { objectType, unionType } from "@nexus/schema";

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
