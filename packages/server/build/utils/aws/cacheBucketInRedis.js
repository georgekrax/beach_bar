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
const redisKeys_1 = __importDefault(require("constants/redisKeys"));
const AWSS3Bucket_1 = require("entity/AWSS3Bucket");
exports.default = (redis, tableName, redisBucket) => __awaiter(void 0, void 0, void 0, function* () {
    let s3Bucket = redisBucket;
    if (!redisBucket) {
        const bucket = yield AWSS3Bucket_1.AWSS3Bucket.findOne({ tableName });
        if (bucket) {
            s3Bucket = bucket;
            yield redis.sadd(redisKeys_1.default.AWS_S3_BUCKET, JSON.stringify(bucket));
        }
    }
    return s3Bucket;
});
//# sourceMappingURL=cacheBucketInRedis.js.map