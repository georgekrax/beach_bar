// import { tableNames } from "@beach_bar/common";
// import redisKeys from "@/constants/redisKeys";
// import { AWSS3Bucket } from "@/entity/AWSS3Bucket";
// import { Redis } from "ioredis";
// import cacheBucketInRedis from "@/utils/aws/cacheBucketInRedis";

// export const switchS3Bucket = async (redis: Redis, tableName: string): Promise<AWSS3Bucket | undefined> => {
//   let s3Bucket: AWSS3Bucket | undefined;

//   const redisBuckets = await redis.smembers(redisKeys.AWS_S3_BUCKET);
//   const s3Buckets: AWSS3Bucket[] = redisBuckets.map((x: string) => JSON.parse(x));

//   switch (tableName.toLowerCase()) {
//     case tableNames.USER.toLowerCase():
//       {
//         const redisBucket = s3Buckets.find(bucket => bucket.tableName === tableNames.USER.toLowerCase());
//         const res = await cacheBucketInRedis(redis, tableNames.USER.toLowerCase(), redisBucket);
//         s3Bucket = res;
//       }
//       break;

//     // case tableNames.ACCOUNT.toLowerCase():
//     //   {
//     //     const redisBucket = s3Buckets.find(bucket => bucket.tableName === tableNames.ACCOUNT.toLowerCase());
//     //     const res = await cacheBucketInRedis(redis, tableNames.ACCOUNT.toLowerCase(), redisBucket);
//     //     s3Bucket = res;
//     //   }
//     //   break;

//     default:
//       {
//         s3Bucket = undefined;
//       }
//       break;
//   }

//   return s3Bucket;
// };
