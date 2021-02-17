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
exports.switchS3Bucket = void 0;
const common_1 = require("@beach_bar/common");
const redisKeys_1 = __importDefault(require("constants/redisKeys"));
const cacheBucketInRedis_1 = __importDefault(require("utils/aws/cacheBucketInRedis"));
const switchS3Bucket = (redis, tableName) => __awaiter(void 0, void 0, void 0, function* () {
    let s3Bucket;
    const redisBuckets = yield redis.smembers(redisKeys_1.default.AWS_S3_BUCKET);
    const s3Buckets = redisBuckets.map((x) => JSON.parse(x));
    switch (tableName.toLowerCase()) {
        case common_1.tableNames.USER.toLowerCase():
            {
                const redisBucket = s3Buckets.find(bucket => bucket.tableName === common_1.tableNames.USER.toLowerCase());
                const res = yield cacheBucketInRedis_1.default(redis, common_1.tableNames.USER.toLowerCase(), redisBucket);
                s3Bucket = res;
            }
            break;
        default:
            {
                s3Bucket = undefined;
            }
            break;
    }
    return s3Bucket;
});
exports.switchS3Bucket = switchS3Bucket;
