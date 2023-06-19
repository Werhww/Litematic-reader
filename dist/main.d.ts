import { SchematicReader } from "./lib/litematic";
declare class Litematic {
    private file;
    litematic?: SchematicReader;
    constructor(file: Uint8Array);
    read(): Promise<SchematicReader>;
    fileCheck(): Promise<void>;
    getAllBlocks(): Promise<{
        pos: {
            x: number;
            y: number;
            z: number;
        };
        block: string;
    }[]>;
    getBlock(x: number, y: number, z: number): Promise<string>;
    getBlockPalette(): Promise<string[]>;
    getBlockPaletteWithCount(): Promise<{
        [key: string]: {
            block: string;
            count: number;
        };
    }>;
}
export { Litematic };
