import { S3BucketObjectType } from "../typings/constants";
import { generateId } from "../utils/generateId";

/**
 * Returns the serialized valid format of the filename, to upload to AWS S3
 * @param {string} filename - The filename to serialize
 * @param {object} s3Bucket - The S3 Bucket configuration to use
 * @param {string} s3Bucket.signatureVersion - The S3 signature version
 * @param {string} s3Bucket.region - The region of the Bucket
 * @param {string} s3Bucket.name - The name of the Bucket
 * @param {string} s3Bucket.urlExpiration - The seconds to expire after the S3 URL signed request
 * @param {string} s3Bucket.uKeyLength - The length of the unique key ID
 * @param {string} s3Bucket.uKeyAndFilenameSeparator - The separator of the uKey and the serialized filename
 * @returns {string} The serialized filename
 */
export const s3FormatFileName = (filename: string, s3Bucket: S3BucketObjectType): string => {
  const uKey = generateId({ length: s3Bucket.uKeyLength });
  const serializedFileName = filename.toLowerCase().replace(/[^a-z0-9]/g, s3Bucket.uKeyAndFilenameSeparator);
  /*
   * 1,024 bytes are allowed for a S3 object key in UTF-8
   * however UTF-8 supports characters up to 4 bytes
   * so the result is 1024 / 4 = 256
  */
  return `${serializedFileName}${s3Bucket.uKeyAndFilenameSeparator}${uKey}`.substring(0, 256);
}
