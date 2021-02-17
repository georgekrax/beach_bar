"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteResult = exports.DeleteGraphQlType = exports.SuccessResult = exports.SuccessGraphQlType = exports.FileGraphQlType = void 0;
const nexus_1 = require("nexus");
exports.FileGraphQlType = nexus_1.objectType({
    name: "File",
    description: "Represents a user's uploaded file",
    definition(t) {
        t.string("filename", { description: "A string representing the name of the uploaded file" });
        t.string("mimetype", { description: "A string representing the MIME type of the uploaded file, such as image/jpeg" });
        t.string("encoding", { description: "A string representing the file encoding, such as 7bit" });
    },
});
exports.SuccessGraphQlType = nexus_1.objectType({
    name: "Success",
    description: "Info to be returned upon successful operation",
    definition(t) {
        t.boolean("success", { description: "A boolean that indicates if the operation was successful" });
    },
});
exports.SuccessResult = nexus_1.unionType({
    name: "SuccessResult",
    definition(t) {
        t.members("Success", "Error");
    },
    resolveType: item => {
        if (item.name === "Errro") {
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
        if (item.name === "Errro") {
            return "Error";
        }
        else {
            return "Delete";
        }
    },
});
