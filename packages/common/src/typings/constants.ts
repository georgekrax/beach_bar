export interface S3BucketObjectType {
  readonly signatureVersion: string;
  readonly region: string;
  readonly name: string;
  readonly urlExpiration: number;
  readonly uKeyLength: number;
  readonly uKeyAndFilenameSeparator: string;
}