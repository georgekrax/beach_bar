export declare const validateJSDate: (date: Date) => boolean;
export declare const validateTime: (time: string) => boolean;
export declare const parseTime: (time: string) => Date;
export declare const serializeTime: (date: Date) => string;
export declare const serializeTimeString: (time: string) => string;
export declare const TimeScalar: import("@nexus/schema/dist/core").NexusScalarTypeDef<"Time">;
