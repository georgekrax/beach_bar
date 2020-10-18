"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkScopes = void 0;
exports.checkScopes = (payload, scopes) => {
    return payload.scope.some((scope) => scopes.includes(scope));
};
//# sourceMappingURL=checkScopes.js.map