import { ShapeToInterface, Nbt } from "./nbt";
import { Virtual3DCanvas } from "./virtual_canvas";
export declare const SCHEMATIC_SHAPE: {
    readonly Version: "int";
    readonly MinecraftDataVersion: "int";
    readonly Metadata: {
        readonly Name: "string";
        readonly Author: "string";
        readonly Description: "string";
        readonly EnclosingSize: {
            readonly x: "int";
            readonly y: "int";
            readonly z: "int";
        };
        readonly TimeCreated: "long";
        readonly TimeModified: "long";
        readonly TotalBlocks: "int";
        readonly TotalVolume: "int";
        readonly RegionCount: "int";
    };
    readonly Regions: {
        readonly '*': {
            readonly BlockStatePalette: readonly [{
                readonly Name: "string";
                readonly Properties: {
                    readonly '*': "string";
                };
            }];
            readonly BlockStates: "longArray";
            readonly Position: {
                readonly x: "int";
                readonly y: "int";
                readonly z: "int";
            };
            readonly Size: {
                readonly x: "int";
                readonly y: "int";
                readonly z: "int";
            };
            readonly Entities: readonly [{
                readonly '*': "*";
            }];
            readonly TileEntities: readonly [{
                readonly '*': "*";
            }];
            readonly PendingBlockTicks: readonly [{
                readonly '*': "*";
            }];
        };
    };
};
declare const BLOCK_STATE_SHAPE: {
    readonly Name: "string";
    readonly Properties: {
        readonly '*': "string";
    };
};
/**
 * Converts the Nbt form of a block state palette entry into
 * a string like "minecraft:observer[facing=east]".
 */
export declare function blockState(state: ShapeToInterface<typeof BLOCK_STATE_SHAPE>): string;
/**
 * Parses a string like "minecraft:observer[facing=east]" to
 * {Name: "minecraft:observer", Properties: {facing: "east"}}.
 */
export declare function parseBlockState(state: string): ShapeToInterface<typeof BLOCK_STATE_SHAPE>;
/**
 * Keeps track of the palette assignments.
 */
export declare class PaletteManager {
    constructor(empty?: string);
    private readonly palette;
    private readonly paletteList;
    getOrCreatePaletteIndex(blockState: string): number;
    getBlockState(n: number): string;
    bits(): number;
    toNbt(): {
        readonly Name: string;
        readonly Properties: {
            [key: string]: string;
        };
    }[];
}
/**
 * Reads a schematic.
 */
export declare class SchematicReader {
    readonly nbt: Nbt<{
        readonly Version: "int";
        readonly MinecraftDataVersion: "int";
        readonly Metadata: {
            readonly Name: "string";
            readonly Author: "string";
            readonly Description: "string";
            readonly EnclosingSize: {
                readonly x: "int";
                readonly y: "int";
                readonly z: "int";
            };
            readonly TimeCreated: "long";
            readonly TimeModified: "long";
            readonly TotalBlocks: "int";
            readonly TotalVolume: "int";
            readonly RegionCount: "int";
        };
        readonly Regions: {
            readonly '*': {
                readonly BlockStatePalette: readonly [{
                    readonly Name: "string";
                    readonly Properties: {
                        readonly '*': "string";
                    };
                }];
                readonly BlockStates: "longArray";
                readonly Position: {
                    readonly x: "int";
                    readonly y: "int";
                    readonly z: "int";
                };
                readonly Size: {
                    readonly x: "int";
                    readonly y: "int";
                    readonly z: "int";
                };
                readonly Entities: readonly [{
                    readonly '*': "*";
                }];
                readonly TileEntities: readonly [{
                    readonly '*': "*";
                }];
                readonly PendingBlockTicks: readonly [{
                    readonly '*': "*";
                }];
            };
        };
    }>;
    readonly nbtData: ShapeToInterface<typeof SCHEMATIC_SHAPE>;
    readonly palette: PaletteManager;
    readonly blocks: Virtual3DCanvas;
    constructor(fileContents: Uint8Array);
    getBlock(x: number, y: number, z: number): string;
    get version(): number;
    get minecraftDataVersion(): number;
    get name(): string;
    get author(): string;
    get description(): string;
    get totalBlocks(): number;
    get totalVolume(): number;
    get enclosingSize(): {
        readonly x: number;
        readonly y: number;
        readonly z: number;
    };
    get width(): number;
    get height(): number;
    get length(): number;
    get timeCreated(): bigint;
    get timeModified(): bigint;
}
/**
 * Simple interface for writing schematics with a
 * single region. Uses a virtual infinite space for
 * setting blocks, and then uses the smallest bounding box
 * when saving.
 */
export declare class SchematicWriter {
    name: string;
    author: string;
    nbt: Nbt<{
        readonly Version: "int";
        readonly MinecraftDataVersion: "int";
        readonly Metadata: {
            readonly Name: "string";
            readonly Author: "string";
            readonly Description: "string";
            readonly EnclosingSize: {
                readonly x: "int";
                readonly y: "int";
                readonly z: "int";
            };
            readonly TimeCreated: "long";
            readonly TimeModified: "long";
            readonly TotalBlocks: "int";
            readonly TotalVolume: "int";
            readonly RegionCount: "int";
        };
        readonly Regions: {
            readonly '*': {
                readonly BlockStatePalette: readonly [{
                    readonly Name: "string";
                    readonly Properties: {
                        readonly '*': "string";
                    };
                }];
                readonly BlockStates: "longArray";
                readonly Position: {
                    readonly x: "int";
                    readonly y: "int";
                    readonly z: "int";
                };
                readonly Size: {
                    readonly x: "int";
                    readonly y: "int";
                    readonly z: "int";
                };
                readonly Entities: readonly [{
                    readonly '*': "*";
                }];
                readonly TileEntities: readonly [{
                    readonly '*': "*";
                }];
                readonly PendingBlockTicks: readonly [{
                    readonly '*': "*";
                }];
            };
        };
    }>;
    description: string;
    paletteManager: PaletteManager;
    canvas: Virtual3DCanvas;
    version: number;
    minecraftDataVersion: number;
    constructor(name: string, author: string);
    /**
     * Gets the index of the given block state in the palette,
     * adding it to the palette if necessary.
     */
    getOrCreatePaletteIndex(blockState: string): number;
    /**
     * Sets the block (x, y, z) to the given block state.
     */
    setBlock(x: number, y: number, z: number, blockState: string): void;
    /**
     * Gets the block state at (x, y, z)
     */
    getBlock(x: number, y: number, z: number): string;
    asNbtData(): ShapeToInterface<typeof SCHEMATIC_SHAPE>;
    save(): Promise<Uint8Array>;
}
export {};
