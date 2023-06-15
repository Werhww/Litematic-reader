# Litematic-reader
Example:
```ts
import { Litematic } from '@kleppe/litematic-reader'

async function example(file: string) {
  const litematic = new Litematic(file)
  
  /* 
    Gets all block in  litematic file and return with block id and position
  */
  console.log(await litematic.getAllBlocks()) 
  /* 
    logs: [
      {pos {x: 0, y: 0, z:0} block: 'minecraft:air'},
      {pos {x: 0, y: 0, z:1} block: 'minecraft:stone'}
      etc...
    ]
  */

  /* 
    Get a specific block in litematic file
  */
  console.log(await litematic.getBlock(0, 0, 0))
  /*
    logs: 'minecraft:air'
  */

  /* Get a palette of all the diffrent blocks with counts them */
  console.log(await litematic.getBlockPaletteWithCount())
  /*
    logs: {
      'minecraft:stone': { block: 'minecraft:smooth_quartz', count: 355 },
      'minecraft:air': { block: 'minecraft:air', count: 1551 },
      etc...
    }
  */

  /* Get a palette of all the diffrent blocks */
  console.log(await litematic.getBlockPalette())
  /* 
    logs: [
      'minecraft:air',
      'minecraft:stone',
      etc...
    ]
  */

  /* The functions above all read individually */
  await litematic.read() // Only needed for the operations beneath


  /* Can also access other file data */
  console.log(litematic.litematic?.totalBlocks) // 2
  console.log(litematic.litematic?.palette) /* 
  PaletteManager {
    palette: [],
    paletteList: []
  }
  */
  console.log(litematic.litematic?.version) // 14
  console.log(litematic.litematic?.author) // Minecraft Name
  console.log(litematic.litematic?.name) // Litematic Name
  console.log(litematic.litematic?.description) // Litematic Description
}

example('file.litematic')
```