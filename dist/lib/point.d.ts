export type Point = `${number}:${number}:${number}`;
/**
 * A string representation of a 3D point, which can be used
 * as a readonly point struct with structural equality,
 * or as an object key.
 */
export declare function p(x: number, y: number, z: number): Point;
export declare function parseP(point: Point): [number, number, number];
