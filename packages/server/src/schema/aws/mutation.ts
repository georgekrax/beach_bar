import { MyContext, S3ACLPermissions, s3FormatFileName } from "@beach_bar/common";
import { extendType, stringArg } from "@nexus/schema";
import { S3PayloadReturnType } from "@typings/aws";
import { switchS3Bucket } from "@utils/aws/switchS3Bucket";
import aws from "aws-sdk";
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
        tableName: stringArg({
          required: true,
          description: "The name of the table in PostgreSQL",
        }),
      },
      resolve: async (_, { filename, filetype, tableName }, { redis }: MyContext): Promise<S3PayloadReturnType | null> => {
        const s3Bucket = await switchS3Bucket(redis, tableName);
        if (!s3Bucket) {
          return null;
        }

        const { signatureVersion, region, name, urlExpiration } = s3Bucket;
        const s3Key = s3FormatFileName(filename, s3Bucket);

        const s3 = new aws.S3({
          signatureVersion: signatureVersion,
          region: region,
        });

        const params = {
          Bucket: name,
          Key: s3Key,
          Expires: urlExpiration,
          ContentType: filetype,
          ACL: S3ACLPermissions.PUBLIC_READ,
          RequestPayer: "requester",
        };

        const signedRequest = s3.getSignedUrl("putObject", params);
        const url = `https://${name}.${process.env.AWS_S3_HOSTNAME!.toString()}/${s3Key}`;

        return {
          signedRequest,
          url,
        };
      },
    });
  },
});
