import { readFile } from 'fs/promises';
import { SchematicReader } from "./lib/litematic";
import { decompress } from "./lib/compression";
class Litematic {
    constructor(file) {
        this.file = file;
    }
    async read() {
        const buffer = await readFile(this.file);
        const decompressed = await decompress(buffer);
        const litematic = new SchematicReader(decompressed);
        this.litematic = litematic;
        return litematic;
    }
    async fileCheck() {
        if (!this.litematic)
            await this.read();
        if (!this.litematic)
            return;
    }
    async getAllBlocks() {
        await this.fileCheck();
        const litematic = this.litematic;
        const blocks = [];
        for (let h = 0; h < litematic.blocks.height; h++) {
            for (let w = 0; w < litematic.blocks.width; w++) {
                for (let l = 0; l < litematic.blocks.length; l++) {
                    const block = litematic.getBlock(w, h, l);
                    blocks.push({
                        pos: {
                            x: w,
                            y: h,
                            z: l
                        },
                        block
                    });
                }
            }
        }
        return blocks;
    }
}
export { Litematic };
//# sourceMappingURL=main.js.map