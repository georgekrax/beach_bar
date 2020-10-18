"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardBrandType = void 0;
const schema_1 = require("@nexus/schema");
exports.CardBrandType = schema_1.objectType({
    name: "CardBrand",
    description: "Represents the brand of a credit or debit card",
    definition(t) {
        t.int("id", { nullable: false });
        t.string("name", { nullable: false });
    },
});
//# sourceMappingURL=cardBrandTypes.js.map