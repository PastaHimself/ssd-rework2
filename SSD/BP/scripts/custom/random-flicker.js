import { 
    world, 
    system, 
    BlockPermutation,
    Block
} from "@minecraft/server";

const LIGHT_BLOCK_IDS = [
    "minecraft:torch",
    "minecraft:wall_torch",
    "minecraft:lantern",
    "minecraft:glowstone",
    "minecraft:sea_lantern",
    "minecraft:shroomlight",
    "minecraft:lit_furnace"
];

const FLICKER_CHANCE_PER_CHECK = 0.0001;
const TICKS_PER_CHECK = 1000;
const OFF_DURATION_TICKS = 5; 

const trackedLightLocations = new Set();

function createLocationKey(loc, dimensionId) {
    return `${Math.floor(loc.x)},${Math.floor(loc.y)},${Math.floor(loc.z)}|${dimensionId}`;
}

function parseLocationKey(key) {
    const [coords, dimensionId] = key.split('|');
    const [x, y, z] = coords.split(',').map(Number);
    return { x, y, z, dimensionId };
}

function flickerBlock(block, key) {
    if (!block || !LIGHT_BLOCK_IDS.includes(block.typeId)) {
        trackedLightLocations.delete(key);
        return; 
    }

    try {
        const dimension = block.dimension;
        const location = block.location;
        const originalPermutation = block.permutation; 

        dimension.setBlockType(location, "minecraft:air");

        system.runTimeout(() => {
            const currentBlock = dimension.getBlock(location);
            if (currentBlock && currentBlock.typeId === "minecraft:air") {
                 dimension.setBlockPermutation(location, originalPermutation);
            }
        }, OFF_DURATION_TICKS); 

    } catch (e) {
        trackedLightLocations.delete(key);
    }
}

world.afterEvents.playerPlaceBlock.subscribe(event => {
    const block = event.block;
    if (LIGHT_BLOCK_IDS.includes(block.typeId)) {
        const key = createLocationKey(block.location, block.dimension.id);
        trackedLightLocations.add(key);
    }
});

world.afterEvents.playerBreakBlock.subscribe(event => {
    const block = event.block;
    if (LIGHT_BLOCK_IDS.includes(block.typeId)) {
        const key = createLocationKey(block.location, block.dimension.id);
        trackedLightLocations.delete(key);
    }
});

world.afterEvents.explosion.subscribe(event => {
    const impactedBlocks = event.getImpactedBlocks();
    for (const block of impactedBlocks) {
        const key = createLocationKey(block.location, block.dimension.id);
        trackedLightLocations.delete(key);
    }
});

system.runInterval(() => {
    if (Math.random() < FLICKER_CHANCE_PER_CHECK) {
        
        const keys = Array.from(trackedLightLocations);

        if (keys.length > 0) {
            const randomIndex = Math.floor(Math.random() * keys.length);
            const keyToFlicker = keys[randomIndex];
            
            const { x, y, z, dimensionId } = parseLocationKey(keyToFlicker);
            
            try {
                let dimension;
                if (dimensionId === "minecraft:overworld" || dimensionId === "overworld") {
                    dimension = world.getDimension("minecraft:overworld");
                } else if (dimensionId === "minecraft:nether" || dimensionId === "nether") {
                    dimension = world.getDimension("minecraft:nether");
                } else if (dimensionId === "minecraft:the_end" || dimensionId === "the_end") {
                    dimension = world.getDimension("minecraft:the_end");
                } else {
                    trackedLightLocations.delete(keyToFlicker);
                    return;
                }
                
                const blockToFlicker = dimension.getBlock({ x, y, z });
                flickerBlock(blockToFlicker, keyToFlicker);

            } catch (e) {
                trackedLightLocations.delete(keyToFlicker);
            }
        }
    }
}, TICKS_PER_CHECK);
