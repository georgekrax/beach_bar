"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findCountry = exports.findBrowser = exports.findOs = exports.createUserLoginDetails = exports.findLoginDetails = void 0;
const common_1 = require("@the_hashtag/common");
const LoginDetails_1 = require("entity/LoginDetails");
const findLoginDetails = ({ details, uaParser }) => {
    const obj = {
        osId: undefined,
        browserId: undefined,
        countryAlpha2Code: undefined,
        city: (details === null || details === void 0 ? void 0 : details.city) || undefined,
    };
    if (details) {
        const osName = uaParser.getOS().name || undefined;
        if (osName)
            obj.osId = exports.findOs(osName);
        const browserName = uaParser.getBrowser().name || undefined;
        if (browserName)
            obj.browserId = exports.findOs(browserName);
        if (details.countryAlpha2Code)
            obj.countryId = exports.findCountry(details.countryAlpha2Code);
    }
    return obj;
};
exports.findLoginDetails = findLoginDetails;
const createUserLoginDetails = (status, platform, account, osId, browserId, countryId, city, ipAddr) => __awaiter(void 0, void 0, void 0, function* () {
    const loginDetails = LoginDetails_1.LoginDetails.create({
        account,
        platformId: platform.id,
        browserId,
        osId,
        countryId,
        city,
        ipAddr: ipAddr || undefined,
        status,
    });
    try {
        yield loginDetails.save();
    }
    catch (err) {
        throw new Error(err.message);
    }
});
exports.createUserLoginDetails = createUserLoginDetails;
const findOs = (osName) => {
    if (!osName)
        return undefined;
    const os = common_1.OS_ARR.find(({ name }) => name.toLowerCase() === osName.toLowerCase());
    if (!os)
        return undefined;
    return os.id;
};
exports.findOs = findOs;
const findBrowser = (browserName) => {
    if (!browserName)
        return undefined;
    const browser = common_1.BROWSERS_ARR.find(({ name }) => name.toLowerCase() === browserName.toLowerCase());
    if (!browser)
        return undefined;
    return browser.id;
};
exports.findBrowser = findBrowser;
const findCountry = (countryCode) => {
    if (!countryCode)
        return undefined;
    const country = common_1.COUNTRIES_ARR.find(({ alpha2Code }) => alpha2Code === countryCode);
    if (!country)
        return undefined;
    return country.id;
};
exports.findCountry = findCountry;
