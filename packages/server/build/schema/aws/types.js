"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3PayloadType = void 0;
const graphql_1 = require("@the_hashtag/common/dist/graphql");
const nexus_1 = require("nexus");
exports.S3PayloadType = nexus_1.objectType({
    name: "S3Payload",
    description: "Represents the payload (data) of Amazon Web Services (AWS) S3",
    definition(t) {
        t.field("signedRequest", { type: graphql_1.UrlScalar });
        t.field("url", {
            type: graphql_1.UrlScalar,
            description: "The presigned URL gives you access to the object identified in the URL, to upload the user's image",
        });
    },
});
