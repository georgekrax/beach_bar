import { objectType, unionType } from "@nexus/schema";

export const FileGraphQlType = objectType({
  name: "File",
  description: "Represents a user's uploaded file",
  definition(t) {
    t.string("filename", { nullable: false, description: "A string representing the name of the uploaded file" });
    t.string("mimetype", {
      nullable: false,
      description: "A string representing the MIME type of the uploaded file, such as image/jpeg",
    });
    t.string("encoding", { nullable: false, description: "A string representing the file encoding, such as 7bit" });
  },
});

export const SuccessGraphQlType = objectType({
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

export const DeleteGraphQlType = objectType({
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
