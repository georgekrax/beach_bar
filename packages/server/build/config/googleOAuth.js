"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleOAuth2Client = void 0;
const google_auth_library_1 = require("google-auth-library");
exports.googleOAuth2Client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_OAUTH_CLIENT_ID, process.env.GOOGLE_OAUTH_CLIENT_SECRET, process.env.GOOGLE_OAUTH_REDIRECT_URI);
//# sourceMappingURL=googleOAuth.js.map