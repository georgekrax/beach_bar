"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3PayloadType = void 0;
const common_1 = require("@georgekrax-hashtag/common");
const schema_1 = require("@nexus/schema");
exports.S3PayloadType = schema_1.objectType({
    name: "S3Payload",
    description: "Represents the payload (data) of Amazon Web Services (AWS) S3",
    definition(t) {
        t.field("signedRequest", { type: common_1.UrlScalar, nullable: false });
        t.field("url", {
            type: common_1.UrlScalar,
            nullable: false,
            description: "The presigned URL gives you access to the object identified in the URL, to upload the user's image",
        });
    },
});
//# sourceMappingURL=types.js.map