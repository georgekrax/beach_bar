import { UrlScalar } from "@the_hashtag/common/dist/graphql";
import { objectType } from "nexus";

export const S3PayloadType = objectType({
  name: "S3Payload",
  description: "Represents the payload (data) of Amazon Web Services (AWS) S3",
  definition(t) {
    t.field("signedRequest", { type: UrlScalar });
    t.field("url", {
      type: UrlScalar,
      description: "The presigned URL gives you access to the object identified in the URL, to upload the user's image",
    });
  },
});
