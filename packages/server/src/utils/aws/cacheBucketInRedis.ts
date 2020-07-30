import { Redis } from "ioredis";
import { AWSS3Bucket } from "@entity/AWSS3Bucket";
import redisKeys from "@constants/redisKeys";

export default async (redis: Redis, tableName: string, redisBucket?: AWSS3Bucket): Promise<AWSS3Bucket | undefined> => {
  let s3Bucket: AWSS3Bucket | undefined = redisBucket;
  if (!redisBucket) {
    const bucket = await AWSS3Bucket.findOne({ tableName });
    if (bucket) {
      s3Bucket = bucket;
      await redis.sadd(redisKeys.AWS_S3_BUCKET, JSON.stringify(bucket));
    }
  }
  return s3Bucket;
};
