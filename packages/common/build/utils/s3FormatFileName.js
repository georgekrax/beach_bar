"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3FormatFileName = void 0;
const generateId_1 = require("../utils/generateId");
exports.s3FormatFileName = (filename, s3Bucket) => {
    const uKey = generateId_1.generateId({ length: s3Bucket.uKeyLength });
    const serializedFileName = filename.toLowerCase().replace(/[^a-z0-9]/g, s3Bucket.uKeyAndFilenameSeparator);
    return `${serializedFileName}${s3Bucket.uKeyAndFilenameSeparator}${uKey}`.substring(0, 256);
};
//# sourceMappingURL=s3FormatFileName.js.map