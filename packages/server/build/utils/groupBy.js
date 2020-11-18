"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupBy = void 0;
exports.groupBy = (list, keyGetter) => {
    const map = new Map();
    list.forEach(item => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        }
        else {
            collection.push(item);
        }
    });
    return map;
};
//# sourceMappingURL=groupBy.js.map