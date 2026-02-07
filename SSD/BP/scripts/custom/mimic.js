import { world, system, EntityComponentTypes } from "@minecraft/server";

const CONFIG = {
    MIMIC_CHANCE: 0.05,
    ACTIVATION_RADIUS: 16,
    AGGRO_RADIUS: 5,
    TARGET_FAMILIES: ["cow", "sheep", "pig", "chicken"],
    TAG_ID: "mimicry:entity",
    GLITCH_SOUND: "mob.endermen.stare",
    STALK_SPEED: 0.15
};

class VectorUtils {
    static distance(loc1, loc2) {
        return Math.sqrt(
            Math.pow(loc1.x - loc2.x, 2) + 
            Math.pow(loc1.y - loc2.y, 2) + 
            Math.pow(loc1.z - loc2.z, 2)
        );
    }

    static subtract(v1, v2) {
        return { x: v1.x - v2.x, y: v1.y - v2.y, z: v1.z - v2.z };
    }

    static normalize(v) {
        const len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
        if (len === 0) return { x: 0, y: 0, z: 0 };
        return { x: v.x / len, y: v.y / len, z: v.z / len };
    }

    static getLookRotation(sourceLoc, targetLoc) {
        const diff = this.subtract(targetLoc, sourceLoc);
        const dist = Math.sqrt(diff.x * diff.x + diff.z * diff.z);
        
        const yaw = Math.atan2(diff.z, diff.x) * (180 / Math.PI) - 90;
        const pitch = -Math.atan2(diff.y, dist) * (180 / Math.PI);
        
        return { x: pitch, y: yaw };
    }
}

class MimicAI {
    constructor() {
        this.tickRate = 2;
        system.runInterval(() => this.update(), this.tickRate);
        
        system.runInterval(() => this.scanAndInfect(), 200);
    }

    scanAndInfect() {
        const players = world.getAllPlayers();
        for (const player of players) {
            const dimension = player.dimension;
            const entities = dimension.getEntities({
                location: player.location,
                maxDistance: 64,
                excludeTags: [CONFIG.TAG_ID]
            });

            for (const entity of entities) {
                const matchesFamily = CONFIG.TARGET_FAMILIES.some(fam => 
                    entity.typeId.includes(fam)
                );

                if (matchesFamily && Math.random() < CONFIG.MIMIC_CHANCE) {
                    entity.addTag(CONFIG.TAG_ID);
                }
            }
        }
    }

    update() {
        const players = world.getAllPlayers();
        if (players.length === 0) return;

        for (const player of players) {
            const dimension = player.dimension;
            const mimics = dimension.getEntities({
                tags: [CONFIG.TAG_ID],
                location: player.location,
                maxDistance: 32
            });

            for (const mimic of mimics) {
                if (!mimic.isValid) continue;
                this.handleMimicBehavior(mimic, player);
            }
        }
    }

    handleMimicBehavior(mimic, player) {
        const dist = VectorUtils.distance(mimic.location, player.location);
        
        const rotation = VectorUtils.getLookRotation(mimic.location, player.getHeadLocation());
        
        mimic.teleport(mimic.location, {
            dimension: mimic.dimension,
            rotation: { x: rotation.x, y: rotation.y },
            keepVelocity: true
        });

        const isBeingWatched = this.isPlayerLookingAt(player, mimic);

        if (dist < CONFIG.AGGRO_RADIUS) {
            if (Math.random() > 0.8) {
                this.performGlitch(mimic, player);
            }
            mimic.triggerEvent("minecraft:stop_walking"); 
            
        } else if (dist < CONFIG.ACTIVATION_RADIUS) {
            if (!isBeingWatched) {
                this.moveTowards(mimic, player.location, CONFIG.STALK_SPEED);
            } else {
                mimic.clearVelocity();
            }
        }
    }

    moveTowards(entity, targetLoc, speed) {
        const dir = VectorUtils.normalize(VectorUtils.subtract(targetLoc, entity.location));
        
        const currentVel = entity.getVelocity();
        entity.applyImpulse({
            x: (dir.x * speed) - currentVel.x * 0.5,
            y: 0,
            z: (dir.z * speed) - currentVel.z * 0.5
        });
    }

    performGlitch(entity, target) {
        const dimension = entity.dimension;
        
        const pitch = Math.random() > 0.5 ? 0.1 : 1.8;
        dimension.playSound(CONFIG.GLITCH_SOUND, entity.location, {
            volume: 0.5,
            pitch: pitch
        });

        dimension.spawnParticle("minecraft:obsidian_glow_dust_particle", {
            x: entity.location.x,
            y: entity.location.y + 0.5,
            z: entity.location.z
        });

        const randomOffset = {
            x: (Math.random() - 0.5) * 0.5,
            y: 0,
            z: (Math.random() - 0.5) * 0.5
        };

        try {
            entity.teleport({
                x: entity.location.x + randomOffset.x,
                y: entity.location.y,
                z: entity.location.z
            });
        } catch (e) {
        }
    }

    isPlayerLookingAt(player, entity) {
        const viewDir = player.getViewDirection();
        const toEntity = VectorUtils.normalize(VectorUtils.subtract(entity.location, player.location));
        
        const dot = (viewDir.x * toEntity.x) + (viewDir.y * toEntity.y) + (viewDir.z * toEntity.z);
        
        return dot > 0.6;
    }
}

const mimicSystem = new MimicAI();

world.afterEvents.chatSend.subscribe((event) => {
    if (event.message === "!spawnmimic") {
        const player = event.sender;
        const dimension = player.dimension;
        
        const cow = dimension.spawnEntity("minecraft:cow", player.location);
        cow.addTag(CONFIG.TAG_ID);
    }
});
