"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutation = void 0;
const common_1 = require("@georgekrax-hashtag/common");
const schema_1 = require("@nexus/schema");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const types_1 = require("./types");
exports.Mutation = schema_1.mutationType({
    description: "Mutation",
    definition(t) {
        t.field("uploadSingleFile", {
            type: types_1.FileGraphQlType,
            description: "Upload a single file",
            nullable: true,
            args: {
                file: schema_1.arg({
                    type: common_1.UploadScalar,
                    required: true,
                    description: "The file to upload",
                }),
            },
            resolve: (_, { file }) => __awaiter(this, void 0, void 0, function* () {
                const { createReadStream, filename, mimetype, encoding } = yield file;
                yield new Promise(res => createReadStream()
                    .pipe(fs_1.createWriteStream(path_1.default.join(__dirname, "../../images", `${filename}_${uuid_1.v4()}`)))
                    .on("close", res));
                return { filename, mimetype, encoding };
            }),
        });
        t.string("hello", {
            description: "Sample mutation",
            args: {
                name: schema_1.stringArg({ nullable: true }),
            },
            resolve: (_, { name }) => {
                if (name) {
                    return `Hello ${name}!`;
                }
                else {
                    return "Hello world!";
                }
            },
        });
    },
});
//# sourceMappingURL=mutation.js.map