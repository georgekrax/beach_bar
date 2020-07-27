"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateId = void 0;
exports.generateId = ({ specialCharacters = "@#./&", lowerCase = true, upperCase = true, numbersOnly = false, numbers = true, hyphen = true, underscore = true }) => {
    let result = "";
    let characters = "";
    if (lowerCase) {
        characters.concat("abcdefghijklmnopqrstuvwxyz");
    }
    if (upperCase) {
        characters.concat("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    }
    if (numbers) {
        characters.concat("0123456789");
    }
    if (hyphen) {
        characters.concat("-");
    }
    if (underscore) {
        characters.concat("_");
    }
    if (numbersOnly) {
        characters = "0123456789";
    }
    if (specialCharacters) {
        characters.concat(specialCharacters);
    }
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
//# sourceMappingURL=generateId.js.map