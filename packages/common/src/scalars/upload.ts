import { scalarType } from "@nexus/schema";
import { GraphQLUpload } from "apollo-server-express";

export const UploadScalar = scalarType({
  name: "Upload",
  asNexusMethod: "upload",
  description: GraphQLUpload?.description,
  serialize: GraphQLUpload!.serialize,
  parseValue: GraphQLUpload?.parseValue,
  parseLiteral: GraphQLUpload?.parseLiteral,
});