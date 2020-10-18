"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentStatusType = void 0;
const schema_1 = require("@nexus/schema");
exports.PaymentStatusType = schema_1.objectType({
    name: "PaymentStatus",
    description: "Represents the status of a payment",
    definition(t) {
        t.int("id", { nullable: false });
        t.string("status", { nullable: false });
    },
});
//# sourceMappingURL=types.js.map