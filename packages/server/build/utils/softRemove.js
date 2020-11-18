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
Object.defineProperty(exports, "__esModule", { value: true });
exports.softRemove = void 0;
const typeorm_1 = require("typeorm");
exports.softRemove = (primaryRepo, primaryOptions, repositories, findOptions) => __awaiter(void 0, void 0, void 0, function* () {
    if (repositories && findOptions) {
        repositories.forEach((repository) => __awaiter(void 0, void 0, void 0, function* () {
            yield typeorm_1.getConnection().getRepository(repository).softDelete(findOptions);
        }));
    }
    if (typeorm_1.getConnection().getMetadata(primaryRepo).name === "Payment") {
        yield primaryRepo.update(primaryOptions, { isRefunded: true });
    }
    else {
        yield typeorm_1.getConnection().getRepository(primaryRepo).softDelete(primaryOptions);
    }
});
//# sourceMappingURL=softRemove.js.map