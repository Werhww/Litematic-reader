export declare function checkExhaustive(a: never): never;
export declare function assertInstanceOf<T>(value: unknown, constructorType: {
    new (...args: any[]): T;
}): T;
export declare function assertNotNull<T>(a: T | null | undefined): Exclude<T, null | undefined>;
export interface ParallelMapOptions {
    max: number;
}
export declare function parallelMap<T, R>(array: T[], options: ParallelMapOptions, mapper: (v: T, i: number, arr: T[]) => Promise<R>): Promise<R[]>;
export declare function base64(array: Uint8Array): string;
export declare function $(query: string): HTMLElement;
export declare function $<T extends HTMLElement>(query: string, constructorType?: {
    new (...args: any[]): T;
}): T;
