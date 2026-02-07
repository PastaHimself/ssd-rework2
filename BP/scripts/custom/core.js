import { world, system, ItemStack, TimeOfDay, GameMode } from "@minecraft/server";
import { transferPlayer } from "@minecraft/server-admin";

// Track if the initial message has been sent
let initialMessageSent = false;

// Check for first world and send initial message
system.runInterval(() => {
    if (initialMessageSent) return;
    
    const players = world.getPlayers();
    if (players.length > 0) {
        const gameTime = world.getAbsoluteTime();
        // Send message after about 55 seconds (when game time is between 1100-1150 ticks)
        if (gameTime > 1100 && gameTime < 1150) {
            for (const player of players) {
                try {
                    player.sendMessage("§eerr.type=null. joined the game");
                } catch (err) {
                    console.warn(`Error sending initial message: ${err}`);
                }
            }
            initialMessageSent = true;
        }
    }
}, 20);

world.beforeEvents.chatSend.subscribe((event) => {
    const overworld = world.getDimension("overworld");
    const message = event.message;
    const senderName = event.sender.name;

    const validMessages = [
        "Hello", "What do you want?", "Can you see me?", "Steve", "Herobrine", "Null", "Entity 303",
        "How can i help you?", "Who are you?", "Nothingiswatching", "Circuit", "Void", "clan_build",
        "Follow", "The broken end", "Revuxor", "Fuck you", "xXram2dieXx", "Integrity", "!help", "!render_10", "!safemode"
    ];

    if (!validMessages.includes(message)) return;

    system.runTimeout(() => {
        const players = world.getPlayers();
        const sender = players.find(p => p.name === senderName);
        if (!sender) return;

        if (message === "Hello") {
            for (const player of players) {
                try {
                    player.playSound("ambient.cave");
                } catch (err) {
                    console.warn(`Errore comando per ${player.name}: ${err}`);
                }
            }
            try {
                sender.sendMessage("<null> err.type=null.hello");
            } catch (err) {
                console.warn(`ERROR ${senderName}: ${err}`);
            }
        } else if (message === "What do you want?") {
            try {
                sender.sendMessage("<null> err.type=null.freedom");
            } catch (err) {
                console.warn(`ERROR ${senderName}: ${err}`);
            }
        } else if (message === "Can you see me?") {
            try {
                sender.sendMessage("<null> Yes.");
            } catch (err) {
                console.warn(`ERROR ${senderName}: ${err}`);
            }

            system.runTimeout(() => {
                try {
                    sender.sendMessage("<null> Hello.");
                } catch (err) {
                    console.warn(`ERROR (null) ${senderName}: ${err}`);
                }

                system.runTimeout(() => {
                    try {
                        overworld.runCommand("execute as @a at @s run summon lightning_bolt ~ ~ ~");
                        for (const player of world.getPlayers()) {
                            player.onScreenDisplay.setTitle("sn_ek");
                        }
                        for (const player of world.getPlayers()) {
                            player.addTag("ui_fix");
                        }
                    } catch (err) {
                        console.warn(`ERROR (summon) ${senderName}: ${err}`);
                    }
                }, 20);
            }, 40);
        } else if (message === "Steve") {
            try {
                sender.sendMessage("<null> [0.1]");
            } catch (err) {
                console.warn(`ERROR ${senderName}: ${err}`);
            }
        } else if (message === "Herobrine") {
            try {
                sender.sendMessage("<null>");
            } catch (err) {
                console.warn(`ERROR ${senderName}: ${err}`);
            }
        } else if (message === "Entity 303") {
            try {
                sender.sendMessage("<null> Ended his own life.");
            } catch (err) {
                console.warn(`ERROR ${senderName}: ${err}`);
            }
        } else if (message === "How can i help you?") {
            try {
                sender.sendMessage("[?][?][?]");
            } catch (err) {
                console.warn(`ERROR ${senderName}: ${err}`);
            }
        } else if (message === "Who are you?") {
            try {
                sender.sendMessage("<null> err.type=null.");
            } catch (err) {
                console.warn(`ERROR ${senderName}: ${err}`);
            }
        } else if (message === "Nothingiswatching") {
            try {
                sender.sendMessage("<null> A broken promise.");
            } catch (err) {
                console.warn(`ERROR ${senderName}: ${err}`);
            }
        } else if (message === "Circuit") {
            try {
                sender.sendMessage("<null> It was all his fault.");
            } catch (err) {
                console.warn(`ERROR ${senderName}: ${err}`);
            }
        } else if (message === "Void") {
            try {
                sender.sendMessage("It's me.");
            } catch (err) {
                console.warn(`ERROR ${senderName}: ${err}`);
            }
        } else if (message === "clan_build") {
            try {
                sender.sendMessage("<null> Home.");
            } catch (err) {
                console.warn(`ERROR ${senderName}: ${err}`);
            }
        } else if (message === "Follow") {
            try {
                sender.sendMessage("<null> Is behind you.");
            } catch (err) {
                console.warn(`ERROR ${senderName}: ${err}`);
            }
        } else if (message === "The broken end") {
            try {
                sender.sendMessage("<Circuit> Administration.");
            } catch (err) {
                console.warn(`ERROR ${senderName}: ${err}`);
            }
        } else if (message === "Revuxor") {
            try {
                sender.sendMessage("<null> Poor soul.");
            } catch (err) {
                console.warn(`ERROR ${senderName}: ${err}`);
            }
        } else if (message === "Integrity") {
            try {
                sender.sendMessage("<null> Deep down under the bedrock.");
            } catch (err) {
                console.warn(`ERROR ${senderName}: ${err}`);
            }
        } else if (message === "!help") {
            try {
                sender.sendMessage("<Makeradam> Hi i'm Makeradam, the original creator of this port, just here to give you a hint: say §g!render_10§r in chat if your render distance goes down to 2, say §g!safemode§r in chat for activating safemode and disabling house griefing, §4WARNING§r ENTITIES DO NOT DESPAWN IF THEY KILL YOU BUT YOU DONT HAVE A BED! ☣ ☣ ☣ ");
            } catch (err) {
                console.warn(`ERROR ${senderName}: ${err}`);
            }
        } else if (message === "xXram2dieXx") {
            try {
                sender.sendMessage("<null> Rot in hell.");
                for (const player of world.getPlayers()) {
                    player.setGameMode(GameMode.Survival);
                }
                for (const player of world.getPlayers()) {
                    player.kill();
                }
            } catch (err) {
                console.warn(`ERROR ${senderName}: ${err}`);
            }
        } else if (message === "Fuck you") {
            try {
                overworld.runCommand("execute as @a at @s run setblock ~~-1~ air destroy");
                for (const player of world.getPlayers()) {
                    player.kill();
                }
            } catch (err) {
                console.warn(`ERROR ${senderName}: ${err}`);
            }
        } else if (message === "!render_10") {
            try {
                sender.runCommand("function render_10");
            } catch (err) {
                console.warn(`ERROR ${senderName}: ${err}`);
            }
        } else if (message === "!safemode") {
            try {
                for (const player of world.getPlayers()) {
                    player.addTag("safe");
                }
            } catch (err) {
                console.warn(`ERROR ${senderName}: ${err}`);
            }
        }
    }, 100);
});

world.beforeEvents.chatSend.subscribe((event) => {
    const message = event.message;
    const senderName = event.sender.name;

    if (message === "Null") {
        system.runTimeout(() => {
            const players = world.getPlayers();
            const sender = players.find(p => p.name === senderName);
            if (!sender) return;

            try {
                sender.sendMessage("<null> The end is nigh.");
            } catch (err) {
                console.warn(`ERROR (nigh) ${senderName}: ${err}`);
            }

            system.runTimeout(() => {
                try {
                    sender.sendMessage("<null> The end is null.");
                } catch (err) {
                    console.warn(`ERROR (null) ${senderName}: ${err}`);
                }

                system.runTimeout(() => {
                    try {
                        const summonLoc = {
                            x: sender.location.x - 10,
                            y: sender.location.y + 1,
                            z: sender.location.z - 10
                        };
                        sender.dimension.runCommand(`summon "thebrokenscript:null_is_here" ${summonLoc.x} ${summonLoc.y} ${summonLoc.z}`);
                    } catch (err) {
                        console.warn(`ERROR (summon) ${senderName}: ${err}`);
                    }
                }, 20);
            }, 40);
        }, 100);
    }
});

function findPlacePos(pos, dimension, view) {
    const behindPos = {
        x: Math.floor(pos.x - view.x * 2),
        y: Math.floor(pos.y),
        z: Math.floor(pos.z - view.z * 2)
    };
    return behindPos;
}

system.runInterval(() => {
    const players = world.getPlayers();
    if (players.length === 0) return;
    const randomIndex = Math.floor(Math.random() * players.length);
    const randomPlayer = players[randomIndex];
    const dimension = randomPlayer.dimension;
    const healthComp = randomPlayer.getComponent("health");
    if (!healthComp) return;
    const health = healthComp.currentValue;
    const gameTime = world.getAbsoluteTime();
    const roll = Math.random();
    const pos = randomPlayer.location;
    const discNames = ["minecraft:music_disc_11", "minecraft:music_disc_13"];
    const randName = Math.floor(Math.random() * discNames.length);
    const disc = new ItemStack(discNames[randName], 1);
    if (health > 0 && roll <= 0.01 && gameTime > 17800) {
        dimension.spawnItem(disc, pos);
    }
}, 720);

system.runInterval(() => {
    const players = world.getPlayers();
    if (players.length === 0) return;
    const roll = Math.random();
    const gameTime = world.getAbsoluteTime();
    if (roll <= 0.02 && gameTime > 48300) {
        world.setTimeOfDay(TimeOfDay.Midnight);
        for (const player of players) {
            const healthComp = player.getComponent("health");
            if (!healthComp) continue;
            const health = healthComp.currentValue;
            const gamemode = player.getGameMode();
            if (health > 0) {
                player.stopMusic();
                player.runCommand("function song");
                if (gamemode !== GameMode.Survival) {
                    player.setGameMode(GameMode.Survival);
                }
            }
        }
    }
}, 1000);

system.runInterval(() => {
    const players = world.getPlayers();
    if (players.length === 0) return;
    const roll = Math.random();
    const gameTime = world.getAbsoluteTime();
    if (roll <= 0.02 && gameTime > 29300) {
        for (const player of players) {
            const healthComp = player.getComponent("health");
            if (!healthComp) continue;
            const health = healthComp.currentValue;
            if (health > 0) {
                player.stopMusic();
                player.runCommand("function record_11");
            }
        }
    }
}, 800);

system.runInterval(() => {
    const players = world.getPlayers();
    if (players.length === 0) return;
    const roll = Math.random();
    const gameTime = world.getAbsoluteTime();
    for (const player of players) {
        const healthComp = player.getComponent("health");
        if (!healthComp) continue;
        const health = healthComp.currentValue;
        const dimension = player.dimension;
        const pos = player.location;
        if (health > 0 && roll <= 0.01 && gameTime > 23900) {
            dimension.spawnEntity("minecraft:lightning_bolt", pos);
        }
    }
}, 400);

system.runInterval(() => {
    const players = world.getPlayers();
    if (players.length === 0) return;
    const randomIndex = Math.floor(Math.random() * players.length);
    const randomPlayer = players[randomIndex];
    const view = randomPlayer.getViewDirection();
    const pos = randomPlayer.location;
    const healthComp = randomPlayer.getComponent("health");
    if (!healthComp) return;
    const health = healthComp.currentValue;
    const dimension = randomPlayer.dimension;
    const behindPos = findPlacePos(pos, dimension, view);
    const roll = Math.random();
    const gameTime = world.getAbsoluteTime();

    if (behindPos && roll <= 0.01 && gameTime > 32000 && health > 0) {
        try {
            const block = dimension.getBlock(behindPos);
            if (block) {
                block.setType("minecraft:redstone_torch");
            }
        } catch (err) {
            console.warn(`Error placing torch: ${err}`);
        }
    }
}, 320);

world.afterEvents.entityLoad.subscribe((event) => {
    const { entity } = event;
    const typeId = entity.typeId;
    if (typeId === "minecraft:villager_v2" && entity.nameTag !== "TESTIFICATE") {
        entity.nameTag = "TESTIFICATE";
    }
});

world.afterEvents.entitySpawn.subscribe((event) => {
    const { entity } = event;
    const typeId = entity.typeId;
    if (typeId === "minecraft:villager_v2" && entity.nameTag !== "TESTIFICATE") {
        entity.nameTag = "TESTIFICATE";
    }
});

system.runInterval(() => {
    const players = world.getPlayers();
    if (players.length === 0) return;
    const randomIndex = Math.floor(Math.random() * players.length);
    const randomPlayer = players[randomIndex];
    const pos = randomPlayer.location;
    const gamemode = randomPlayer.getGameMode();
    const healthComp = randomPlayer.getComponent("health");
    if (!healthComp) return;
    const health = healthComp.currentValue;
    const roll = Math.random();
    const gameTime = world.getAbsoluteTime();

    const highPos = {
        x: pos.x,
        y: pos.y + 20,
        z: pos.z
    };

    if (gamemode === GameMode.Survival && health > 0 && roll <= 0.01 && gameTime > 31000) {
        try {
            const block = randomPlayer.dimension.getBlock(highPos);
            if (block) {
                const belowBlock = block.below();
                if (belowBlock) {
                    belowBlock.setType("minecraft:dirt");
                    block.setType("minecraft:water");
                    belowBlock.setType("minecraft:air");
                }
            }
        } catch (err) {
            console.warn(`Error spawning water: ${err}`);
        }
    }
}, 620);

system.runInterval(() => {
    const gameTime = world.getAbsoluteTime();
    const roll = Math.random();
    if (gameTime > 11700 && roll <= 0.01) {
        const overworld = world.getDimension("overworld");
        const entities = overworld.getEntities({ excludeTypes: ["minecraft:player"] });
        for (const entity of entities) {
            if (entity.typeId === "minecraft:villager_v2") {
                entity.remove();
            }
        }
    }
}, 320);

system.afterEvents.scriptEventReceive.subscribe((event) => {
    if (event.id === "thebrokenscript:kick") {
        const entity = event.sourceEntity;
        if (entity && entity.typeId === "minecraft:player") {
            const players = world.getPlayers();
            const player = players.find(p => p.id === entity.id);
            if (player) {
                transferPlayer(player, { hostname: "nullintegrityparty.void", port: 33122 });
            }
        }
    }
});
