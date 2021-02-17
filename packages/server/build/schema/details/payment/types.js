"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentStatusType = void 0;
const nexus_1 = require("nexus");
exports.PaymentStatusType = nexus_1.objectType({
    name: "PaymentStatus",
    description: "Represents the status of a payment",
    definition(t) {
        t.id("id");
        t.string("status");
    },
});
