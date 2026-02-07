import { world } from "@minecraft/server";

export function findPlacePos(center, dimension, view, attempts = 40, minRad = 2, maxRad = 5, minYRad = -1, maxYRad = 1) {
  for (let i = 0; i < attempts; i++) {
    const radiusX = minRad + Math.random() * (maxRad - minRad);
    const radiusZ = minRad + Math.random() * (maxRad - minRad);
    const radiusY = minYRad + Math.random() * (maxYRad - minYRad);
    
    const dy = Math.floor(radiusY);
    const dx = Math.floor(view.x * radiusX);
    const dz = Math.floor(view.z * radiusZ);
    
    const spawnY = Math.floor(center.y + dy);
    const spawnX = Math.floor(center.x - dx);
    const spawnZ = Math.floor(center.z - dz);

      const pos = {
x: spawnX,
y: spawnY,
z: spawnZ
};

      if (isValidPlacePos(pos, dimension)) {
        return pos;
    }
  }

  return null;
}


function isValidPlacePos(blockLoc, dimension) {
  const validBlocks = ["minecraft:air","minecraft:tall_grass", "minecraft:tall_dry_grass", "minecraft:deadbush", "minecraft:yellow_flower", "minecraft:red_flower", "minecraft:brown_mushroom", "minecraft:red_mushroom", "minecraft:sugar_cane", "minecraft:torch", "minecraft:oak_sapling", "minecraft:sunflower", "minecraft:standing_sign", "minecraft:redstone_torch", "minecraft:crimson_fungus", "minecraft:crimson_roots"];
  const mainBlock = dimension.getBlock(blockLoc);
  const blockBelow = mainBlock.below();

  if (!mainBlock || !blockBelow) return false;

if (
    blockBelow.isAir || blockBelow.isLiquid
  ) return false;
  if (
    !validBlocks.includes(mainBlock.typeId)
  ) return false;

  return true;
}

