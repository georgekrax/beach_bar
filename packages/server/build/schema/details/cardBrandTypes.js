"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardBrandType = void 0;
const nexus_1 = require("nexus");
exports.CardBrandType = nexus_1.objectType({
    name: "CardBrand",
    description: "Represents the brand of a credit or debit card",
    definition(t) {
        t.id("id");
        t.string("name");
    },
});
