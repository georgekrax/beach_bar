"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkScopes = void 0;
const checkScopes = (payload, scopes) => {
    return payload.scope.some((scope) => scopes.includes(scope));
};
exports.checkScopes = checkScopes;
