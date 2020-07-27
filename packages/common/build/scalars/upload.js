"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadScalar = void 0;
const schema_1 = require("@nexus/schema");
const apollo_server_express_1 = require("apollo-server-express");
exports.UploadScalar = schema_1.scalarType({
    name: "Upload",
    asNexusMethod: "upload",
    description: apollo_server_express_1.GraphQLUpload === null || apollo_server_express_1.GraphQLUpload === void 0 ? void 0 : apollo_server_express_1.GraphQLUpload.description,
    serialize: apollo_server_express_1.GraphQLUpload.serialize,
    parseValue: apollo_server_express_1.GraphQLUpload === null || apollo_server_express_1.GraphQLUpload === void 0 ? void 0 : apollo_server_express_1.GraphQLUpload.parseValue,
    parseLiteral: apollo_server_express_1.GraphQLUpload === null || apollo_server_express_1.GraphQLUpload === void 0 ? void 0 : apollo_server_express_1.GraphQLUpload.parseLiteral,
});
//# sourceMappingURL=upload.js.map