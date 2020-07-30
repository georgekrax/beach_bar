export interface S3BucketObjectType {
    readonly signatureVersion: string;
    readonly region: string;
    readonly name: string;
    readonly urlExpiration: number;
    readonly keyLength: number;
    readonly keyAndFilenameSeparator: string;
    readonly tableName: string;
}
