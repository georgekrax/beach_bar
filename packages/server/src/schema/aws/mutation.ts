import { S3PayloadReturnType } from "@/typings/aws";
import { errors } from "@beach_bar/common";
import { S3BucketConfigType, s3FormatFileName, transformObjectKey } from "@the_hashtag/common";
import { ApolloError } from "apollo-server-express";
import aws from "aws-sdk";
import { extendType, stringArg } from "nexus";
import { S3PayloadType } from "./types";

const S3_BUCKETS: Record<string, S3BucketConfigType> = {
  "USER-ACCOUNT-IMAGES": {
    name: "user-account-images",
    signatureVersion: "v4",
    region: "eu-west-1",
    key: { filenameSeparator: "_", length: 12 },
  },
};

export const AWSMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("signS3", {
      type: S3PayloadType,
      description: "Sign the S3 URL for an object",
      args: {
        filename: stringArg({ description: "The name of the file to sign (upload)" }),
        filetype: stringArg({ description: "The type of the file to sign (upload)" }),
        s3Bucket: stringArg({ description: "The name of bucket in AWS S3" }),
      },
      resolve: async (_, { filename, filetype, s3Bucket }): Promise<S3PayloadReturnType> => {
        const bucket = S3_BUCKETS[transformObjectKey(s3Bucket)];
        if (!bucket) throw new ApolloError(errors.SOMETHING_WENT_WRONG, errors.INTERNAL_SERVER_ERROR);
        const { name, signatureVersion, region } = bucket;
        const s3Key = s3FormatFileName(filename, bucket);

        const s3 = new aws.S3({ signatureVersion, region });

        const params = {
          Bucket: name,
          Key: s3Key,
          Expires: 60 * 1.5,
          ContentType: filetype,
          ACL: "public-read",
          RequestPayer: "requester",
        };

        const signedRequest = await s3.getSignedUrlPromise("putObject", params);
        const url = `https://${name}.${process.env.AWS_S3_HOSTNAME}/${s3Key}`;

        return {
          signedRequest,
          url,
        };
      },
    });
  },
});
