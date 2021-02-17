"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Query = void 0;
const nexus_1 = require("nexus");
exports.Query = nexus_1.queryType({
    description: "Query",
    definition(t) {
        t.string("hello", {
            resolve: (_, __, { payload }) => {
                if (payload) {
                    return `Hello world, ${payload.sub}!`;
                }
                return "Hello world!";
            },
        });
    },
});
