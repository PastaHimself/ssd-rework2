import { world, system } from "@minecraft/server";

world.afterEvents.entitySpawn.subscribe((event) => {
    const { entity } = event;

    if (entity.typeId !== "thebrokenscript:circuit_mineshaft") return;

    const dimension = entity.dimension;
    const location = entity.location;
    let foundWood = false;

    searchLoop:
    for (let x = -3; x <= 3; x++) {
        for (let y = -3; y <= 3; y++) {
            for (let z = -3; z <= 3; z++) {
                const block = dimension.getBlock({
                    x: location.x + x,
                    y: location.y + y,
                    z: location.z + z
                });

                if (block) {
                    if (
                        block.hasTag("wood") || 
                        block.hasTag("log") || 
                        block.typeId.includes("log") || 
                        block.typeId.includes("planks") || 
                        block.typeId.includes("wood")
                    ) {
                        foundWood = true;
                        break searchLoop;
                    }
                }
            }
        }
    }

    if (!foundWood) {
        system.run(() => {
            if (entity.isValid) {
                entity.remove();
            }
        });
    }
});