import { world, system, EquipmentSlot } from '@minecraft/server';

const processedDeceivers = new Set();

system.afterEvents.scriptEventReceive.subscribe((event) => {
    const { id, sourceEntity, message } = event;
    
    if (id === 'thebrokenscript:copy_inventory' && sourceEntity) {
        handleCopyInventory(sourceEntity);
    }
});

function handleCopyInventory(deceiver) {
    const deceiverId = deceiver.id;
    
    if (processedDeceivers.has(deceiverId)) {
        return;
    }
    
    processedDeceivers.add(deceiverId);
    
    try {
        if (!deceiver.hasComponent('inventory')) {
            console.warn('Deceiver does not have inventory component');
            return;
        }
        
        const players = Array.from(world.getPlayers());
        if (players.length === 0) return;
        
        let nearestPlayer = players[0];
        let nearestDistance = getDistance(deceiver.location, nearestPlayer.location);
        
        for (let i = 1; i < players.length; i++) {
            const distance = getDistance(deceiver.location, players[i].location);
            if (distance < nearestDistance) {
                nearestPlayer = players[i];
                nearestDistance = distance;
            }
        }
        
        if (!nearestPlayer.hasComponent('inventory')) {
            console.warn('Nearest player does not have inventory component');
            return;
        }
        
        copyPlayerInventory(nearestPlayer, deceiver);
        
        deceiver.triggerEvent('thebrokenscript:copy_inventory');
        
    } catch (error) {
        console.warn('Error copying inventory: ' + error);
    } finally {
        
        processedDeceivers.delete(deceiverId);
    }
}

function getDistance(loc1, loc2) {
    const dx = loc1.x - loc2.x;
    const dy = loc1.y - loc2.y;
    const dz = loc1.z - loc2.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function copyPlayerInventory(player, deceiver) {
    const playerInventory = player.getComponent('inventory').container;
    const deceiverInventory = deceiver.getComponent('inventory').container;
    
    for (let i = 0; i < 36; i++) {
        const item = playerInventory.getItem(i);
        try {
            deceiverInventory.setItem(i, item);
        } catch (error) {
            console.warn(`Failed to copy item at slot ${i}: ${error}`);
        }
    }
    
    const armorSlots = [
        { playerSlot: 103, deceiverSlot: 'head' },
        { playerSlot: 102, deceiverSlot: 'chest' },
        { playerSlot: 101, deceiverSlot: 'legs' },
        { playerSlot: 100, deceiverSlot: 'feet' }
    ];
    
    if (deceiver.hasComponent('equippable')) {
        const equippable = deceiver.getComponent('equippable');
        
        for (const armor of armorSlots) {
            const armorItem = playerInventory.getItem(armor.playerSlot);
            if (armorItem) {
                try {
                    switch (armor.deceiverSlot) {
                        case 'head':
                            equippable.setEquipment(EquipmentSlot.Head, armorItem);
                            break;
                        case 'chest':
                            equippable.setEquipment(EquipmentSlot.Chest, armorItem);
                            break;
                        case 'legs':
                            equippable.setEquipment(EquipmentSlot.Legs, armorItem);
                            break;
                        case 'feet':
                            equippable.setEquipment(EquipmentSlot.Feet, armorItem);
                            break;
                    }
                } catch (error) {
                    console.warn(`Failed to equip ${armor.deceiverSlot} armor: ${error}`);
                }
            }
        }
    } else {
        console.warn('Deceiver does not have equippable component, skipping armor copy');
    }
    
    try {
        const offhandItem = playerInventory.getItem(36);
        if (offhandItem && deceiverInventory.size > 36) {
            deceiverInventory.setItem(36, offhandItem);
        }
    } catch (error) {
        console.warn(`Failed to copy offhand item: ${error}`);
    }
}

world.afterEvents.entityRemove.subscribe((event) => {
    processedDeceivers.delete(event.removedEntityId);
});

system.runInterval(() => {
    
    for (const entityId of processedDeceivers) {
        try {
            const entity = world.getEntity(entityId);
            if (!entity) {
                processedDeceivers.delete(entityId);
            }
        } catch (error) {
            processedDeceivers.delete(entityId);
        }
    }
}, 6000);