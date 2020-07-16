"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterSearch = void 0;
exports.filterSearch = (filterIds, array) => {
    for (const filter of filterIds) {
        switch (filter) {
            case "653":
                return array.filter((result) => result.hasAvailability && result.hasCapacity);
            default:
                return array;
        }
    }
    return array;
};
//# sourceMappingURL=filterSearch.js.map