"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateId = void 0;
exports.generateId = ({ length, specialCharacters = "@#./&-_", lowerCase = true, upperCase = true, numbersOnly = false, numbers = true, }) => {
    let result = "";
    let characters = "";
    if (lowerCase) {
        characters = characters.concat("abcdefghijklmnopqrstuvwxyz");
    }
    if (upperCase) {
        characters = characters.concat("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    }
    if (numbers) {
        characters = characters.concat("0123456789");
    }
    if (numbersOnly) {
        characters = "0123456789";
    }
    if (specialCharacters) {
        characters = characters.concat(specialCharacters);
    }
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
//# sourceMappingURL=generateId.js.map