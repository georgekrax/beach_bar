"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Buckets = exports.S3ACLPermissions = void 0;
exports.S3ACLPermissions = Object.freeze({
    PUBLIC_READ: "public-read",
});
exports.S3Buckets = Object.freeze({
    USER_PROFILE_IMAGE: {
        signatureVersion: "v4",
        region: "eu-west-1",
        name: "beach-bar.user_profile_image",
        urlExpiration: 60,
        uKeyLength: 16,
        uKeyAndFilenameSeparator: "-",
    },
});
//# sourceMappingURL=aws.js.map