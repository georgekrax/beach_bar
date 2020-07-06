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
exports.validatePasswordSchema = exports.passwordValidationSchema = exports.validateEmailSchema = exports.emailValidationSchema = exports.validateUserSchema = exports.userValidationSchema = exports.invalidEmail = exports.passwordNotLongEnough = exports.emailNotLongEnough = void 0;
const yup = require("yup");
exports.emailNotLongEnough = "Email should be at least five (5) characters";
exports.passwordNotLongEnough = "Password should be at least five (5) characters";
exports.invalidEmail = "Email should be a valid one";
exports.userValidationSchema = yup.object().shape({
    email: yup
        .string()
        .min(5, exports.emailNotLongEnough)
        .max(255)
        .email(exports.invalidEmail)
        .required(),
    password: yup.string().min(5, exports.passwordNotLongEnough).max(60).required(),
});
function validateUserSchema(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        yield exports.userValidationSchema
            .validate({ email, password }, { abortEarly: true })
            .catch((err) => {
            err.errors.forEach((err) => {
                throw new Error(`Something went wrong: ${err}`);
            });
        });
    });
}
exports.validateUserSchema = validateUserSchema;
exports.emailValidationSchema = yup.object().shape({
    email: yup
        .string()
        .min(5, exports.emailNotLongEnough)
        .max(255)
        .email(exports.invalidEmail)
        .required(),
});
function validateEmailSchema(email) {
    return __awaiter(this, void 0, void 0, function* () {
        yield exports.emailValidationSchema
            .validate({ email }, { abortEarly: true })
            .catch((err) => {
            err.errors.forEach((err) => {
                throw new Error(err.toString());
            });
        });
    });
}
exports.validateEmailSchema = validateEmailSchema;
exports.passwordValidationSchema = yup.object().shape({
    password: yup.string().min(5, exports.passwordNotLongEnough).max(60).required(),
});
function validatePasswordSchema(password) {
    return __awaiter(this, void 0, void 0, function* () {
        yield exports.passwordValidationSchema
            .validate({ password }, { abortEarly: true })
            .catch((err) => {
            err.errors.forEach((err) => {
                throw new Error(err.toString());
            });
        });
    });
}
exports.validatePasswordSchema = validatePasswordSchema;
//# sourceMappingURL=userSchema.js.map