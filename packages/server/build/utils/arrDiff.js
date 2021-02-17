"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(arr1, arr2) {
    const diff = arr1.filter(x => !arr2.includes(x)).concat(arr2.filter(x => !arr1.includes(x)));
    return diff;
}
exports.default = default_1;
;
