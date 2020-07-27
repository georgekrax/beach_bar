export type S3PayloadReturnType = {
  signedRequest: string;
  url: string;
};

export type FileType = {
  filename: string;
  mimetype: string;
  encoding: string;
};
