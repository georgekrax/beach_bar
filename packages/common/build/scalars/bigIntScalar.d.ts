declare global {
    interface BigInt {
        toJSON(): string;
    }
}
export declare const BigIntScalar: import("@nexus/schema/dist/core").NexusScalarTypeDef<"BigInt">;
