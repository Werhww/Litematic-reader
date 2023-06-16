import { Point } from './point';
/**
 * A sparse representation of an infinite 3d array of ints. Uses
 * 16^3 subchunks as the smallest unit of storage. Supports values
 * up to 16 bits.
 */
export declare class Virtual3DCanvas {
    readonly xSize: number;
    readonly ySize: number;
    readonly zSize: number;
    constructor(xSize?: number, ySize?: number, zSize?: number);
    private segments;
    requires16bits: boolean;
    empty: boolean;
    minx: number;
    maxx: number;
    miny: number;
    maxy: number;
    minz: number;
    maxz: number;
    lastSegmentX: number;
    lastSegmentY: number;
    lastSegmentZ: number;
    lastSegment: Uint16Array | Uint8Array | undefined;
    get width(): number;
    get height(): number;
    get length(): number;
    get(x: number, y: number, z: number): number;
    /** @noline */
    recalculateExtents(x: number, y: number, z: number): void;
    getSegment(x: number, y: number, z: number, create: boolean, require16: boolean): Uint8Array | Uint16Array | undefined;
    set(x: number, y: number, z: number, value: number): void;
    getAllBlocks(): [array: Uint16Array | Uint8Array, nonZero: number];
    [Symbol.iterator](): IterableIterator<[number, number, number, Uint8Array | Uint16Array]>;
}
/**
 * A 3D set.
 */
export declare class Virtual3DSet {
    readonly xSize: number;
    readonly ySize: number;
    readonly zSize: number;
    canvas: Virtual3DCanvas;
    constructor(xSize?: number, ySize?: number, zSize?: number);
    add(x: number, y: number, z: number): void;
    has(x: number, y: number, z: number): boolean;
    getColumn(x: number, y: number, z: number): number;
    readData(data: Uint8Array | Uint16Array, x: number, y: number, z: number): number;
    [Symbol.iterator](): Iterator<[number, number, number, Uint8Array | Uint16Array]>;
}
export interface Virtual2DSetArea {
    array: Uint8Array;
    offset: number;
    areaX: number;
    areaZ: number;
}
export declare class Virtual2DSet {
    readonly regions: Record<Point, Uint8Array>;
    lastRegion: Uint8Array | undefined;
    lastRegionX: number;
    lastRegionZ: number;
    getRegion(regionX: number, regionZ: number, create: boolean): Uint8Array | undefined;
    add(x: number, z: number): void;
    has(x: number, z: number): boolean;
    areas(): Virtual2DSetArea[];
    radius(r: number, x: number, z: number): Virtual2DSetArea[];
    readInArea(array: Uint8Array, offset: number, x: number, z: number): boolean;
    writeInArea(array: Uint8Array, offset: number, x: number, z: number, value: boolean): void;
}
