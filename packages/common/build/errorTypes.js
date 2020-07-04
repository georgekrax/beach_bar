"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Error = exports.ErrorObjectType = void 0;
const schema_1 = require("@nexus/schema");
exports.ErrorObjectType = schema_1.objectType({
    name: "ErrorObject",
    description: "Represents an error object",
    definition(t) {
        t.string("code", {
            nullable: true,
            description: "The error code of the operation, it can be found in a list in the documentation",
        });
        t.string("message", {
            nullable: false,
            description: "A short description for the error occurred",
        });
    },
});
exports.Error = schema_1.objectType({
    name: "Error",
    description: "Represents a formatted error",
    definition(t) {
        t.field("error", {
            type: exports.ErrorObjectType,
            nullable: true,
            description: "Returns an error in a type of string, if there is one, with a status and a message",
        });
    },
});
//# sourceMappingURL=errorTypes.js.map