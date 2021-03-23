import { DateTimeScalar } from "@the_hashtag/common/dist/graphql";
import { interfaceType, objectType, unionType } from "nexus";

export const Node = interfaceType({
  name: "Node",
  description: "The base of a GraphQL Node",
  definition(t) {
    t.id("id");
  },
  resolveType: o => o.id,
});

export const FileGraphQlType = objectType({
  name: "File",
  description: "Represents a user's uploaded file",
  definition(t) {
    t.string("filename", { description: "A string representing the name of the uploaded file" });
    t.string("mimetype", { description: "A string representing the MIME type of the uploaded file, such as image/jpeg" });
    t.string("encoding", { description: "A string representing the file encoding, such as 7bit" });
  },
});

export const SuccessGraphQLType = objectType({
  name: "Success",
  description: "Info to be returned upon successful operation",
  definition(t) {
    t.boolean("success", { description: "A boolean that indicates if the operation was successful" });
  },
});

export const UpdateGraphQLType = interfaceType({
  name: "Update",
  description: "Info to be returned upon successful UPDATE operation",
  definition(t) {
    t.boolean("updated", { description: "A boolean that indicates if the information were updated" });
  },
  resolveType: o => o.updated,
});

export const SuccessResult = unionType({
  name: "SuccessResult",
  definition(t) {
    t.members("Success", "Error");
  },
  resolveType: item => {
    if (item.error) {
      return "Error";
    } else {
      return "Success";
    }
  },
});

export const DeleteGraphQlType = objectType({
  name: "Delete",
  description: "Info to be returned upon successful deletion",
  definition(t) {
    t.boolean("deleted", { description: "A boolean that indicates if the delete operation was successful" });
  },
});

export const DeleteResult = unionType({
  name: "DeleteResult",
  definition(t) {
    t.members("Delete", "Error");
  },
  resolveType: item => {
    if (item.error) {
      return "Error";
    } else {
      return "Delete";
    }
  },
});

export const TimestampGraphQLType = interfaceType({
  name: "Timestamp",
  description: "The timestamp of when something was created",
  definition(t) {
    t.field("timestamp", { type: DateTimeScalar });
  },
  resolveType: o => o.timestamp,
});