"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.link = void 0;
const apollo_link_http_1 = require("apollo-link-http");
const node_fetch_1 = __importDefault(require("node-fetch"));
exports.link = new apollo_link_http_1.HttpLink({
    uri: `${process.env.HASHTAG_API_HOSTNAME.toString()}/graphql`,
    fetch: node_fetch_1.default,
    credentials: "include",
});
//# sourceMappingURL=apolloLink.js.map