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
const apollo_server_express_1 = require("apollo-server-express");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const nexus_1 = require("nexus");
const types_1 = require("./types");
const S3_BUCKETS = {
    "USER-ACCOUNT-IMAGES": {
        name: "user-account-images",
        signatureVersion: "v4",
        region: "eu-west-1",
        key: {
            filenameSeparator: "_",
            length: 12,
        },
    },
};
exports.AWSMutation = nexus_1.extendType({
    type: "Mutation",
    definition(t) {
        t.field("signS3", {
            type: types_1.S3PayloadType,
            description: "Sign the S3 URL for an object",
            args: {
                filename: nexus_1.stringArg({ description: "The name of the file to sign (upload)" }),
                filetype: nexus_1.stringArg({ description: "The type of the file to sign (upload)" }),
                s3Bucket: nexus_1.stringArg({ description: "The name of bucket in AWS S3" }),
            },
            resolve: (_, { filename, filetype, s3Bucket }) => __awaiter(this, void 0, void 0, function* () {
                const bucket = S3_BUCKETS[common_2.transformObjectKey(s3Bucket)];
                if (!bucket)
                    throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG, common_1.errors.INTERNAL_SERVER_ERROR);
                const { name, signatureVersion, region } = bucket;
                const s3Key = common_2.s3FormatFileName(filename, bucket);
                const s3 = new aws_sdk_1.default.S3({ signatureVersion, region });
                const params = {
                    Bucket: name,
                    Key: s3Key,
                    Expires: 60 * 1.5,
                    ContentType: filetype,
                    ACL: "public-read",
                    RequestPayer: "requester",
                };
                const signedRequest = yield s3.getSignedUrlPromise("putObject", params);
                const url = `https://${name}.${process.env.AWS_S3_HOSTNAME.toString()}/${s3Key}`;
                return {
                    signedRequest,
                    url,
                };
            }),
        });
    },
});
