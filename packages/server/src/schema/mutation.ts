import { UploadScalar } from "@beach_bar/common";
import { arg, mutationType, stringArg } from "@nexus/schema";
import { createWriteStream } from "fs";
import path from "path";
import { v4 as uuid } from "uuid";
import { FileGraphQlType } from "./types";
import { FileType } from "@typings/aws";

export const Mutation = mutationType({
  description: "Mutation",
  definition(t) {
    t.field("uploadSingleFile", {
      type: FileGraphQlType,
      description: "Upload a single file",
      nullable: true,
      args: {
        file: arg({
          type: UploadScalar,
          required: true,
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
        name: stringArg({ nullable: true }),
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
