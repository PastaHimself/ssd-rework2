import { world, system } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";

const SCOREBOARD_OBJ = "event_settings";
const GLOBAL_SCORE_KEY = "GLOBAL";
const SCAN_INTERVAL_TICKS = 10;

const EVENTS = [
    null,
    "null_join_event",
    "ram2die_join_event",
    "cave_sound",
    "nullnullnull",
    "opengl",
    "moonglitch",
    "fakebsodd",
    "song",
    "timeSetNoon",
    "timeSetMidnight",
    "flinging",
    "messagges",
    "heartbeat_goaway",
    "setnighthb",
    "nullach",
    "LightningEvent",
    "CameraYank",
    "SkyBedrock",
    "SkyWater",
    "normalambienceevent",
    "keepplaying"
];

const DEFAULT_BITMASK = (1 << (EVENTS.length - 1)) - 1;

function getObjective() {
    let obj = world.scoreboard.getObjective(SCOREBOARD_OBJ);
    if (!obj) obj = world.scoreboard.addObjective(SCOREBOARD_OBJ, "Event Settings");
    return obj;
}

function getGlobalEventBitmask() {
    const obj = getObjective();
    try {
        const score = obj.getScore(GLOBAL_SCORE_KEY);
        return score ?? DEFAULT_BITMASK;
    } catch {
        return DEFAULT_BITMASK;
    }
}

function setGlobalEventBitmask(bitmask) {
    try {
        const obj = getObjective();
        obj.setScore(GLOBAL_SCORE_KEY, bitmask);
        return true;
    } catch (e) {
        console.warn("[settings] failed to set global score:", e);
        return false;
    }
}

function makeBitmaskFromBooleans(list) {
    let mask = 0;
    for (let i = 1; i < list.length; i++) {
        if (list[i]) mask |= (1 << (i - 1));
    }
    return mask;
}

function booleansFromBitmask(mask, max) {
    const arr = [null];
    for (let i = 1; i <= max; i++) arr[i] = !!(mask & (1 << (i - 1)));
    return arr;
}

export function isEventEnabledForAll(eventIndex) {
    const mask = getGlobalEventBitmask();
    return !!(mask & (1 << (eventIndex - 1)));
}

function showSettingsUI(player) {
    const max = EVENTS.length - 1;
    const mask = getGlobalEventBitmask();
    const bools = booleansFromBitmask(mask, max);
    const playerTags = typeof player.getTags === "function" ? (player.getTags() || []) : [];
    const autoDefault = playerTags.includes("stalk_auto:true");

    const form = new ModalFormData().title("Event Settings (GLOBAL)");
    form.textField("Info", "These settings apply to ALL players", { defaultValue: "Global settings" });
    form.toggle("Automatic stalking", { defaultValue: autoDefault });

    for (let i = 1; i <= max; i++) {
        form.toggle(`${i}. ${EVENTS[i]}`, { defaultValue: bools[i] });
    }

    form.textField("Notes", "Saved to scoreboard key: " + GLOBAL_SCORE_KEY, { defaultValue: "Changes affect everyone." });

    form.show(player).then(res => {
        if (res.canceled || !res.formValues) return;

        const autoVal = !!res.formValues[1];
        try {
            if (autoVal) player.addTag?.("stalk_auto:true");
            else player.removeTag?.("stalk_auto:true");
        } catch (e) {}

        const arr = [null];
        for (let i = 1; i <= max; i++) {
            arr[i] = !!res.formValues[i + 1];
        }

        const newMask = makeBitmaskFromBooleans(arr);
        const ok = setGlobalEventBitmask(newMask);

        if (ok) {
            for (const p of world.getAllPlayers()) {
                p.sendMessage("§aGlobal event settings were updated.");
            }
        } else {
            player.sendMessage("§cFailed to save global settings.");
        }
    }).catch(err => {
        console.warn("[settings] UI error:", err);
    });
}

const cooldown = new Map();

system.runInterval(() => {
    try {
        const obj = getObjective();
        try {
            obj.getScore(GLOBAL_SCORE_KEY);
        } catch {
            setGlobalEventBitmask(DEFAULT_BITMASK);
        }
    } catch (e) {
        console.warn("[settings] scoreboard init error:", e);
    }

    for (const player of world.getAllPlayers()) {
        try {
            const inv = player.getComponent("minecraft:inventory")?.container;
            const item = inv?.getItem(player.selectedSlotIndex);
            const holdingClock = item?.typeId === "minecraft:clock";
            const hasAdminTag = player.getTags().includes("admin");

            if (holdingClock && player.isSneaking && hasAdminTag) {
                if (!cooldown.get(player.name)) {
                    showSettingsUI(player);
                    cooldown.set(player.name, true);
                }
            } else {
                cooldown.set(player.name, false);
            }
        } catch (e) {
            console.warn(`[settings] per-player loop error for ${player?.name}: ${e}`);
        }
    }
}, SCAN_INTERVAL_TICKS);

console.warn("[settings] Loaded — global settings enabled. All events true by default.");
