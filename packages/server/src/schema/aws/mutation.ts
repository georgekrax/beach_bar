import { S3ACLPermissions, S3Buckets } from "@beach_bar/common";
import { extendType, stringArg } from "@nexus/schema";
import { S3PayloadReturnType } from "@typings/aws";
import aws from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { S3PayloadType } from "./types";

export const AWSMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("signS3", {
      type: S3PayloadType,
      description: "",
      nullable: true,
      args: {
        filename: stringArg({
          required: true,
          description: "The name of the file to sign (upload)",
        }),
        filetype: stringArg({
          required: true,
          description: "The type of the file to sign (upload)",
        }),
      },
      resolve: async (_, { filename, filetype }): Promise<S3PayloadReturnType> => {
        const { signatureVersion, region, name: s3Bucket, urlExpiration } = S3Buckets.USER_PROFILE_IMAGE;

        const s3 = new aws.S3({
          signatureVersion: signatureVersion,
          region: region,
        });

        const s3Key = `${filename}#${uuidv4()}`;

        const params = {
          Bucket: s3Bucket,
          Key: s3Key,
          Expires: urlExpiration,
          ContentType: filetype,
          ACL: S3ACLPermissions.PUBLIC_READ,
        };

        const signedRequest = await s3.getSignedUrl("putObject", params);
        const url = `https://${s3Bucket}.${process.env.AWS_S3_HOSTNAME!.toString()}/${s3Key}`;

        return {
          signedRequest,
          url,
        };
      },
    });
  },
});
