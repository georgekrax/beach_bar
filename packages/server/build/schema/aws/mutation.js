"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AWSMutation = void 0;
const common_1 = require("@beach_bar/common");
const common_2 = require("@the_hashtag/common");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const nexus_1 = require("nexus");
const switchS3Bucket_1 = require("utils/aws/switchS3Bucket");
const types_1 = require("./types");
exports.AWSMutation = nexus_1.extendType({
    type: "Mutation",
    definition(t) {
        t.nullable.field("signS3", {
            type: types_1.S3PayloadType,
            description: "",
            args: {
                filename: nexus_1.stringArg({ description: "The name of the file to sign (upload)" }),
                filetype: nexus_1.stringArg({ description: "The type of the file to sign (upload)" }),
                tableName: nexus_1.stringArg({ description: "The name of the table in PostgreSQL" }),
            },
            resolve: (_, { filename, filetype, tableName }, { redis }) => __awaiter(this, void 0, void 0, function* () {
                const s3Bucket = yield switchS3Bucket_1.switchS3Bucket(redis, tableName);
                if (!s3Bucket) {
                    return null;
                }
                const { signatureVersion, region, name, urlExpiration } = s3Bucket;
                const s3Key = common_2.s3FormatFileName(filename, s3Bucket);
                const s3 = new aws_sdk_1.default.S3({
                    signatureVersion: signatureVersion,
                    region: region,
                });
                const params = {
                    Bucket: name,
                    Key: s3Key,
                    Expires: urlExpiration,
                    ContentType: filetype,
                    ACL: common_1.S3ACLPermissions.PUBLIC_READ,
                    RequestPayer: "requester",
                };
                const signedRequest = s3.getSignedUrl("putObject", params);
                const url = `https://${name}.${process.env.AWS_S3_HOSTNAME.toString()}/${s3Key}`;
                return {
                    signedRequest,
                    url,
                };
            }),
        });
    },
});
