import { objectType } from "nexus";

export const S3PayloadType = objectType({
  name: "S3Payload",
  description: "Represents the payload (data) of Amazon Web Services (AWS) S3",
  definition(t) {
    t.url("signedRequest");
    t.url("url", {
      description: "The presigned URL gives you access to the object identified in the URL, to upload the user's image",
    });
  },
});
