import * as yup from "yup";
export declare const emailNotLongEnough = "Email should be at least five (5) characters";
export declare const passwordNotLongEnough = "Password should be at least five (5) characters";
export declare const invalidEmail = "Email should be a valid one";
export declare const userValidationSchema: yup.ObjectSchema<yup.Shape<object | undefined, {
    email: string;
    password: string;
}>>;
export declare function validateUserSchema(email: string, password: string): Promise<any>;
export declare const emailValidationSchema: yup.ObjectSchema<yup.Shape<object | undefined, {
    email: string;
}>>;
export declare function validateEmailSchema(email: string): Promise<any>;
export declare const passwordValidationSchema: yup.ObjectSchema<yup.Shape<object | undefined, {
    password: string;
}>>;
export declare function validatePasswordSchema(password: string): Promise<any>;
