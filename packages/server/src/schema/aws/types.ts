import { UrlScalar } from "@beach_bar/common";
import { objectType } from "@nexus/schema";

export const S3PayloadType = objectType({
  name: "S3Payload",
  description: "Represents the payload (data) of Amazon Web Services (AWS) S3",
  definition(t) {
    t.field("signedRequest", { type: UrlScalar, nullable: false, description: "" });
    t.field("url", { type: UrlScalar, nullable: false, description: "" });
  },
});
