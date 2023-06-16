/**
 * An NBT parser/serializer which gives results as plain JS objects
 * and avoids copying large arrays, instead giving DataViews of the
 * original data.
 *
 * In order to provide type safety and distinguish types that have the
 * same JS representation, you can provide a shape object describing
 * the NBT data.
 */
interface NbtCompoundShape {
    readonly [key: string]: NbtShape;
}
type NbtListShape = readonly [NbtShape];
interface NbtCompoundMapShape {
    readonly '*': NbtShape;
}
/**
 * A description of the shape of an Nbt file.
 * Used for parsing validation and as a guide for serialization.
 */
export type NbtShape = 'end' | 'byte' | 'short' | 'int' | 'long' | 'float' | 'double' | 'byteArray' | 'intArray' | 'longArray' | 'string' | '*' | NbtListShape | NbtCompoundMapShape | NbtCompoundShape;
/** Maps simple shape names to their JS representation */
export interface SimpleShapeToInterface {
    end: never;
    byte: number;
    short: number;
    int: number;
    long: bigint;
    float: number;
    double: number;
    byteArray: DataView;
    intArray: DataView;
    longArray: DataView;
    string: string;
    '*': unknown;
}
/**
 * Given a shape T, gives the type of the parsed
 * result of an Nbt value of that shape.
 */
export type ShapeToInterface<T> = T extends keyof SimpleShapeToInterface ? SimpleShapeToInterface[T] : T extends readonly [infer V] ? Array<ShapeToInterface<V>> : T extends ReadonlyArray<infer V> ? Array<ShapeToInterface<V>> : T extends {
    readonly '*': infer V;
} ? {
    [key: string]: ShapeToInterface<V>;
} : {
    [K in keyof T]: ShapeToInterface<T[K]>;
};
/**
 * A Nbt parser and serializer for a given shape.
 * Keeping the shape separate from the data allows
 * the parse result to be a plain JS object without
 * extra metadata on the object types.
 * For example, byte and short are both numbers when read,
 * but must be written differently.
 */
export declare class Nbt<S extends {
    [key: string]: NbtShape;
} | '*'> {
    private shape;
    constructor(shape: S);
    /**
     * Parses the data in the Uint8Array into the JS object
     * given by the shape of this Nbt parser.
     */
    parse(data: Uint8Array, littleEndian?: boolean): ShapeToInterface<S>;
    /**
     * Serializes the JS object into a Uint8Array given
     * by the shape of this Nbt serializer.
     */
    serialize(value: ShapeToInterface<S>): Uint8Array;
    private parseRoot;
    /**
     * Parses the payload value at the current position of the DataViewReader.
     *
     * @param data The data view reader
     * @param tagType The tag of the payload to parse
     * @param shape The shape of the data
     * @param path The path so far, used for error messages
     * @returns The payload value, based
     */
    private parsePayload;
    /**
     * Skips the payload of the given type at the current position of the
     * DataViewReader. Simply advances with minimal processing of the data,
     * so that we can quickly skip over parts that we don't understand.
     * @param data The data view reader
     * @param tagType The tag of the payload to skip
     */
    private skipPayload;
    private assertSimpleShape;
    private assertCompoundShape;
    private assertListShape;
    private serializeRoot;
    private serializePayload;
    private assertNumber;
    private assertBigInt;
    private assertDataView;
    private assertString;
    private assertArray;
    private assertObject;
    private getTagTypeForShape;
}
export {};
