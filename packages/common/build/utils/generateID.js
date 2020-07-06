"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateID = void 0;
exports.generateID = (length) => {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
//# sourceMappingURL=generateID.js.map