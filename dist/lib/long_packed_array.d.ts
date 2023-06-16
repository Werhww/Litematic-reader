/**
 * Reads a packed bit value from a longArray. Items with a specific number of
 * bits are packed into an array of big-endian longs. Within each long, the
 * first item is at the low-order bits, going towards the high bits.
 * If tightlyPacked is set, then there are no unused bits in each long -- an
 * item may straddle multiple longs. Otherwise, the highest bits of each long
 * may be unused if the bitsPerItem doesn't go evenly into 64.
 *
 * As an optimization, the code reads the values in 32 bit chunks, since using
 * getBigUint64 is noticeable slower.
 *
 * Note that bitsPerItem cannot be higher than 16, but Minecraft shouldn't need
 * that much.
 *
 * @param array The DataView of the longArray
 * @param bitsPerItem The number of bits per item
 * @param index The item index
 * @param tightlyPacked Whether the items straddle longs, or there are unused bits
 * @returns The item value
 */
export declare function readLongPackedArray(array: DataView, bitsPerItem: number, index: number, tightlyPacked: boolean): number;
/**
 * Expands the long array into a typed array with items of a constant size.
 * Uses either a Uint8Array or Uint16Array, depending on how many bits are needed
 * to represent the items.
 *
 * @param array The DataView of longArray
 * @param bitsPerItem The number of bits per item
 * @param length The number of items in the list
 * @param tightlyPacked Whether the items straddle longs, or there are unused bits
 * @returns
 */
export declare function expandLongPackedArray(array: DataView, bitsPerItem: number, length: number, tightlyPacked: boolean): Uint8Array | Uint16Array;
