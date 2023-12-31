import { DefaultEndianDataView } from "./default_endian_data_view";
const decoder = new TextDecoder("utf-8");
const encoder = new TextEncoder();
/**
 * Parses utf8 encoded text to a JS string
 *
 * @param array The data to decode
 * @param i The start index
 * @param length The length
 * @returns a JS string
 */
export function decodeUtf8(array, i, length) {
    if (length === 0) {
        return '';
    }
    return decoder.decode(new DataView(array.buffer, array.byteOffset + i, length));
}
/**
 * Encodes the given string as utf8.
 *
 * @param s The string
 * @returns The utf8 encoding as a Uint8Array
 */
export function encodeUtf8Into(s, array, i) {
    const { written } = encoder.encodeInto(s, new Uint8Array(array.buffer, array.byteOffset + i));
    if (written == null) {
        throw new Error(`Encoding string failed: '${s}'`);
    }
    return written;
}
/**
 * Streams data to a DataView.
 * Each writer method moves the cursor forward,
 * and resizing is automatic.
 */
export class DataViewWriter {
    constructor(initialCapacity = 1024, littleEndian = false) {
        this.littleEndian = littleEndian;
        this.i = 0;
        this.data = new DefaultEndianDataView(littleEndian, new ArrayBuffer(initialCapacity));
    }
    byte(n) {
        this.assertCapacity(1);
        this.data.setInt8(this.i, n);
        this.i++;
    }
    short(n) {
        this.assertCapacity(2);
        this.data.setInt16(this.i, n);
        this.i += 2;
    }
    int(n) {
        this.assertCapacity(4);
        this.data.setInt32(this.i, n);
        this.i += 4;
    }
    long(n) {
        this.assertCapacity(8);
        this.data.setBigInt64(this.i, n);
        this.i += 8;
    }
    float(n) {
        this.assertCapacity(4);
        this.data.setFloat32(this.i, n);
        this.i += 4;
    }
    double(n) {
        this.assertCapacity(8);
        this.data.setFloat64(this.i, n);
        this.i += 8;
    }
    string(s) {
        // 1 utf-16 character or unpaired surrogate may
        // become up to 3 bytes of utf-8. Reserve enough space
        this.assertCapacity(s.length * 3);
        const written = encodeUtf8Into(s, this.data, this.i + 2);
        this.data.setUint16(this.i, written);
        this.i += written + 2;
    }
    array(array, width) {
        const nItems = Math.floor(array.byteLength / width);
        this.assertCapacity(array.byteLength + 4);
        this.data.setInt32(this.i, nItems);
        this.i += 4;
        // we can just copy byte-by-byte, since both buffers
        // are big-endian. Use Uint8Arrays to represent the ranges.
        new Uint8Array(this.data.buffer, this.i, array.byteLength)
            .set(new Uint8Array(array.buffer, array.byteOffset, array.byteLength));
        this.i += array.byteLength;
    }
    varint(value) {
        if (value < 0x80) {
            this.byte(value & 0x7f);
        }
        else if (value < 0x4000) {
            this.byte(0x80 | value & 0x7f);
            this.byte(((value & 0x3f80) >>> 7));
        }
        else if (value < 0x200000) {
            this.byte(0x80 | value & 0x7f);
            this.byte(0x80 | ((value & 0x3f80) >>> 7));
            this.byte(((value & 0x1fc000) >>> 14));
        }
        else if (value < 0x10000000) {
            this.byte(0x80 | value & 0x7f);
            this.byte(0x80 | ((value & 0x3f80) >>> 7));
            this.byte(0x80 | ((value & 0x1fc000) >>> 14));
            this.byte(((value & 0xfe00000) >>> 21));
        }
        else {
            this.byte(0x80 | value & 0x7f);
            this.byte(0x80 | ((value & 0x3f80) >>> 7));
            this.byte(0x80 | ((value & 0x1fc000) >>> 14));
            this.byte(0x80 | ((value & 0xfe00000) >>> 21));
            this.byte(((value & 0xF0000000) >>> 28));
        }
    }
    zigZagVarint(value) {
        this.varint((value << 1) ^ (value >> 31));
    }
    final() {
        return this.data.subview(0, this.i);
    }
    /**
     * Assures that the internal buffer can hold newBytes extra
     * bytes, doubling the current buffer size as necessary.
     * @param newBytes The number of new bytes to add
     */
    assertCapacity(newBytes) {
        if (this.i + newBytes > this.data.byteLength) {
            let newSize = this.data.byteLength * 2;
            while (this.i + newBytes > newSize) {
                newSize *= 2;
            }
            const newData = new DefaultEndianDataView(this.littleEndian, new ArrayBuffer(newSize));
            new Uint8Array(newData.buffer).set(new Uint8Array(this.data.buffer));
            this.data = newData;
        }
    }
}
/**
 * Streams data from a DataView.
 * Each accessor method moves the cursor forward,
 * consuming the data.
 */
export class DataViewReader {
    constructor(data) {
        this.data = data;
        this.i = 0;
    }
    byte() {
        this.i += 1;
        return this.data.getInt8(this.i - 1);
    }
    short() {
        this.i += 2;
        return this.data.getInt16(this.i - 2);
    }
    int() {
        this.i += 4;
        return this.data.getInt32(this.i - 4);
    }
    long() {
        this.i += 8;
        return this.data.getBigInt64(this.i - 8);
    }
    string() {
        const length = this.data.getUint16(this.i);
        this.i += 2;
        const string = decodeUtf8(this.data, this.i, length);
        this.i += length;
        return string;
    }
    float() {
        this.i += 4;
        return this.data.getFloat32(this.i - 4);
    }
    double() {
        this.i += 8;
        return this.data.getFloat64(this.i - 8);
    }
    array(width) {
        const length = this.int();
        const result = this.data.subview(this.i, length * width);
        this.i += result.byteLength;
        return result;
    }
    varint() {
        let first4 = this.data.getUint32(this.i, true);
        let result = first4 & 0x7f;
        this.i++;
        for (let shift = 7; shift < 28 && (first4 & 0x80) !== 0; shift += 7) {
            first4 = first4 >>> 8;
            result |= (first4 & 0x7f) << shift;
            this.i++;
        }
        if ((first4 & 0x80) !== 0) {
            const fifth = this.data.getUint8(this.i);
            result |= (fifth & 0x7f) << 28;
            this.i++;
        }
        return result;
    }
    zigZagVarint() {
        const int = this.varint();
        return (int >>> 1) ^ (-(int & 1));
    }
    skip(n) {
        this.i += n;
    }
    skipString() {
        const length = this.data.getUint16(this.i);
        this.i += 2 + length;
    }
    skipArray(width) {
        const length = this.int();
        this.i += length * width;
    }
}
//# sourceMappingURL=data_view_stream.js.map