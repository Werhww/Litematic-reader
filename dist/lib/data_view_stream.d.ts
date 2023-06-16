import { DefaultEndianDataView } from "./default_endian_data_view";
/**
 * Parses utf8 encoded text to a JS string
 *
 * @param array The data to decode
 * @param i The start index
 * @param length The length
 * @returns a JS string
 */
export declare function decodeUtf8(array: DataView, i: number, length: number): string;
/**
 * Encodes the given string as utf8.
 *
 * @param s The string
 * @returns The utf8 encoding as a Uint8Array
 */
export declare function encodeUtf8Into(s: string, array: DataView, i: number): number;
/**
 * Streams data to a DataView.
 * Each writer method moves the cursor forward,
 * and resizing is automatic.
 */
export declare class DataViewWriter {
    readonly littleEndian: boolean;
    i: number;
    data: DefaultEndianDataView;
    constructor(initialCapacity?: number, littleEndian?: boolean);
    byte(n: number): void;
    short(n: number): void;
    int(n: number): void;
    long(n: bigint): void;
    float(n: number): void;
    double(n: number): void;
    string(s: string): void;
    array(array: DataView, width: number): void;
    varint(value: number): void;
    zigZagVarint(value: number): void;
    final(): DefaultEndianDataView;
    /**
     * Assures that the internal buffer can hold newBytes extra
     * bytes, doubling the current buffer size as necessary.
     * @param newBytes The number of new bytes to add
     */
    private assertCapacity;
}
/**
 * Streams data from a DataView.
 * Each accessor method moves the cursor forward,
 * consuming the data.
 */
export declare class DataViewReader {
    readonly data: DefaultEndianDataView;
    i: number;
    constructor(data: DefaultEndianDataView);
    byte(): number;
    short(): number;
    int(): number;
    long(): bigint;
    string(): string;
    float(): number;
    double(): number;
    array(width: number): DataView;
    varint(): number;
    zigZagVarint(): number;
    skip(n: number): void;
    skipString(): void;
    skipArray(width: number): void;
}
