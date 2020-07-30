"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3FormatFileName = void 0;
const generateId_1 = require("../utils/generateId");
exports.s3FormatFileName = (filename, s3Bucket) => {
    const specialCharacters = `${s3Bucket.keyAndFilenameSeparator.trim() === "_"
        ? "_"
        : `${s3Bucket.keyAndFilenameSeparator.trim()}_`}`;
    const uKey = generateId_1.generateId({ length: s3Bucket.keyLength, specialCharacters });
    const extension = filename.match(/\.[0-9a-z]{1,5}$/i);
    if (!extension || !extension.index) {
        return "";
    }
    const serializedFileName = filename
        .substring(extension.index, -1)
        .replace(/[^a-z0-9A-Z]/g, s3Bucket.keyAndFilenameSeparator);
    return (`${uKey}${s3Bucket.keyAndFilenameSeparator}${serializedFileName}`.substring(0, 256 - extension.length) + extension);
};
//# sourceMappingURL=s3FormatFileName.js.map