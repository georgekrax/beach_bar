import { S3BucketObjectType } from "../typings/constants";

export const S3ACLPermissions = Object.freeze({
  PUBLIC_READ: "public-read",
});

export const S3Buckets: Readonly<Record<string, S3BucketObjectType>> = Object.freeze({
  USER_PROFILE_IMAGE: <S3BucketObjectType>{
    signatureVersion: "v4",
    region: "eu-west-1",
    name: "beach-bar.user_profile_image",
    urlExpiration: 60,
    uKeyLength: 16,
    uKeyAndFilenameSeparator: "-",
  },
});
