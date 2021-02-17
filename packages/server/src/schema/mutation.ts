import { UploadScalar } from "@the_hashtag/common/dist/graphql";
import { createWriteStream } from "fs";
import { arg, mutationType, nullable, stringArg } from "nexus";
import path from "path";
import { FileType } from "typings/aws";
import { v4 as uuid } from "uuid";
import { FileGraphQlType } from "./types";

export const Mutation = mutationType({
  description: "Mutation",
  definition(t) {
    t.nullable.field("uploadSingleFile", {
      type: FileGraphQlType,
      description: "Upload a single file",
      args: {
        file: arg({
          type: UploadScalar,
          description: "The file to upload",
        }),
      },
      resolve: async (_, { file }): Promise<FileType> => {
        const { createReadStream, filename, mimetype, encoding } = await file;

        await new Promise(res =>
          createReadStream()
            .pipe(createWriteStream(path.join(__dirname, "../../images", `${filename}_${uuid()}`)))
            .on("close", res)
        );

        return { filename, mimetype, encoding };
      },
    });
    t.string("hello", {
      description: "Sample mutation",
      args: {
        name: nullable(stringArg()),
      },
      resolve: (_, { name }): string => {
        if (name) {
          return `Hello ${name}!`;
        } else {
          return "Hello world!";
        }
      },
    });
  },
});
