"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimestampGraphQLType = exports.DeleteResult = exports.DeleteGraphQlType = exports.SuccessResult = exports.UpdateGraphQLType = exports.SuccessGraphQLType = exports.FileGraphQlType = exports.Node = void 0;
const graphql_1 = require("@the_hashtag/common/dist/graphql");
const nexus_1 = require("nexus");
exports.Node = nexus_1.interfaceType({
    name: "Node",
    description: "The base of a GraphQL Node",
    definition(t) {
        t.id("id");
    },
    resolveType: o => o.id,
});
exports.FileGraphQlType = nexus_1.objectType({
    name: "File",
    description: "Represents a user's uploaded file",
    definition(t) {
        t.string("filename", { description: "A string representing the name of the uploaded file" });
        t.string("mimetype", { description: "A string representing the MIME type of the uploaded file, such as image/jpeg" });
        t.string("encoding", { description: "A string representing the file encoding, such as 7bit" });
    },
});
exports.SuccessGraphQLType = nexus_1.objectType({
    name: "Success",
    description: "Info to be returned upon successful operation",
    definition(t) {
        t.boolean("success", { description: "A boolean that indicates if the operation was successful" });
    },
});
exports.UpdateGraphQLType = nexus_1.interfaceType({
    name: "Update",
    description: "Info to be returned upon successful UPDATE operation",
    definition(t) {
        t.boolean("updated", { description: "A boolean that indicates if the information were updated" });
    },
    resolveType: o => o.updated,
});
exports.SuccessResult = nexus_1.unionType({
    name: "SuccessResult",
    definition(t) {
        t.members("Success", "Error");
    },
    resolveType: item => {
        if (item.error) {
            return "Error";
        }
        else {
            return "Success";
        }
    },
});
exports.DeleteGraphQlType = nexus_1.objectType({
    name: "Delete",
    description: "Info to be returned upon successful deletion",
    definition(t) {
        t.boolean("deleted", { description: "A boolean that indicates if the delete operation was successful" });
    },
});
exports.DeleteResult = nexus_1.unionType({
    name: "DeleteResult",
    definition(t) {
        t.members("Delete", "Error");
    },
    resolveType: item => {
        if (item.error) {
            return "Error";
        }
        else {
            return "Delete";
        }
    },
});
exports.TimestampGraphQLType = nexus_1.interfaceType({
    name: "Timestamp",
    description: "The timestamp of when something was created",
    definition(t) {
        t.field("timestamp", { type: graphql_1.DateTimeScalar });
    },
    resolveType: o => o.timestamp,
});
