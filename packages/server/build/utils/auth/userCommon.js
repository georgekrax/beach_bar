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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findCountry = exports.findBrowser = exports.findOs = exports.createUserLoginDetails = exports.findLoginDetails = void 0;
const LoginDetails_1 = require("entity/LoginDetails");
const fs_1 = __importDefault(require("fs"));
const findLoginDetails = ({ details, uaParser }) => {
    const obj = {
        osId: undefined,
        browserId: undefined,
        countryId: undefined,
        cityId: (details === null || details === void 0 ? void 0 : details.cityId) || undefined,
    };
    if (details) {
        const osName = uaParser.getOS().name || undefined;
        if (osName) {
            obj.osId = exports.findOs(osName);
        }
        const browserName = uaParser.getBrowser().name || undefined;
        if (browserName) {
            obj.browserId = exports.findOs(browserName);
        }
        if (details.countryId) {
            obj.countryId = exports.findCountry(details.countryId);
        }
    }
    return obj;
};
exports.findLoginDetails = findLoginDetails;
const createUserLoginDetails = (status, platform, account, osId, browserId, countryId, cityId, ipAddr) => __awaiter(void 0, void 0, void 0, function* () {
    const loginDetails = LoginDetails_1.LoginDetails.create({
        account,
        platformId: platform.id,
        browserId,
        osId,
        countryId,
        cityId,
        ipAddr,
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
    if (!osName) {
        return undefined;
    }
    console.log(osName);
    const file = JSON.parse(fs_1.default.readFileSync("../../config/clientOs.json", "utf8"));
    const os = file.data.find(data => data.name === osName);
    console.log(os);
    if (!os) {
        return undefined;
    }
    return os.id;
};
exports.findOs = findOs;
const findBrowser = (browserName) => {
    if (!browserName) {
        return undefined;
    }
    console.log(browserName);
    const file = JSON.parse(fs_1.default.readFileSync("../../config/clientBrowser.json.json", "utf8"));
    const browser = file.data.find(data => data.name === browserName);
    console.log(browser);
    if (!browser) {
        return undefined;
    }
    return browser.id;
};
exports.findBrowser = findBrowser;
const findCountry = (countryId) => {
    if (!countryId) {
        return undefined;
    }
    console.log(countryId);
    const file = JSON.parse(fs_1.default.readFileSync("../../config/countries.json.json", "utf8"));
    const country = file.data.find(data => Number(data.id) === Number(countryId));
    console.log(country);
    if (!country) {
        return undefined;
    }
    return country.id;
};
exports.findCountry = findCountry;
