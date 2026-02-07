// Improved Stalker Script (Bedrock Script API)
// - Cave support (safe 2-block spawn pockets + "cave mode" spawning)
// - Dimension support (delayed cross-dimension relocation)
// - Optimization (tick throttling + round-robin stalker updates)
// - Jumpscare: if player gets too close -> blindness + stalker vanishes
// - Extra: fear/intensity system + additional chat commands

import { world, system, EffectTypes } from "@minecraft/server";

// Your custom stalker entity identifier
const STALKER_ID = "thebrokenscript:null_ground";

const TAG_AUTO = "stalk_auto:true";

/**
 * CONFIG
 * NOTE: durations are in ticks (20 ticks = 1 second)
 */
const CONFIG = {
  // Core distances
  MIN_STALK_DISTANCE: 25,
  MAX_STALK_DISTANCE: 70,
  OPTIMAL_STALK_DISTANCE: 45,
  DESPAWN_DISTANCE: 110,
  DANGER_DISTANCE: 35,

  // Spawn/relocate
  SPAWN_COOLDOWN_TICKS: 400,
  MAX_STALKERS_PER_PLAYER: 1,
  SPAWN_HEIGHT_VARIANCE: 12,
  PREFER_BEHIND_CHANCE: 0.7,
  RELOCATE_INTERVAL: 1800,
  TELEPORT_CHECK_INTERVAL: 60,

  // “Watched” behavior - UPDATED FOR VISIBILITY
  ROTATION_SMOOTHNESS: 0.3,    // Increased slightly so it snaps to look at you faster
  HIDE_ON_LOOK_CHANCE: 0.0,    // Set to 0 (was 0.6). It will NOT hide randomly when glanced at.
  VANISH_ON_STARE_TICKS: 120,  // Increased to 120 (6 seconds) so you can look at it longer.

  // Horror ambience
  AMBIENT_SOUND_CHANCE: 0.03,
  WHISPER_SOUND_CHANCE: 0.01,
  PARTICLE_SPAWN_CHANCE: 0.15,

  // Jumpscare
  JUMPSCARE_DISTANCE: 6,
  BLINDNESS_TICKS: 80, // 4 seconds
  DARKNESS_TICKS: 60,  // 3 seconds (optional if effect exists)
  JUMPSCARE_COOLDOWN_TICKS: 600, // per-player

  // Cave support
  CAVE_SCAN_UP: 16,              // used to determine if the player is "under a roof"
  CAVE_CEILING_MAX_DIST: 8,      // spawn must have a ceiling within this distance (when in cave mode)
  CAVE_ENCLOSED_SIDE_MIN: 1,     // at least this many solid sides near head level

  // Safe spawn search
  SPAWN_ATTEMPTS: 18,
  VERTICAL_SEARCH_DOWN: 40,
  VERTICAL_SEARCH_UP: 20,

  // Dimension support
  DIMENSION_SWITCH_DELAY_TICKS: 40,

  // Optimization / scheduling
  AI_UPDATE_INTERVAL: 2,         // run AI every N ticks
  SPAWN_CHECK_INTERVAL: 20,      // run spawn checks every N ticks
  MAX_STALKER_UPDATES_PER_RUN: 12, // round-robin budget

  // Fear / intensity (extra feature)
  FEAR_MAX: 100,
  FEAR_DECAY_TICKS: 100,         // decay every 5 seconds
  FEAR_DECAY_AMOUNT: 2,
  FEAR_ON_DETECTION: 3,
  FEAR_ON_JUMPSCARE: 20,
};

// ---------- STATE ----------

class StalkerState {
  constructor() {
    /** @type {Map<string, any>} */
    this.stalkerData = new Map();
    /** @type {Map<string, any>} */
    this.playerTracking = new Map();
    this.lastCleanup = 0;
    this.roundRobinIndex = 0;
  }

  registerStalker(entity, targetPlayerId) {
    this.stalkerData.set(entity.id, {
      entity,
      targetPlayerId,
      spawnTime: system.currentTick,
      lastRelocate: system.currentTick,
      lastPlayerLook: 0,
      consecutiveLookTicks: 0,
      behaviorState: "stalking",
      ticksExisted: 0,
      detectionCount: 0,
      lastSoundTick: 0,
      preferredDistance: CONFIG.OPTIMAL_STALK_DISTANCE,

      // dimension support
      lastKnownDimensionId: entity.dimension?.id,
      pendingDimSwitchTick: 0,
    });
  }

  getStalker(entityId) {
    return this.stalkerData.get(entityId);
  }

  removeStalker(entityId) {
    const data = this.stalkerData.get(entityId);
    if (data) {
      const tracking = this.playerTracking.get(data.targetPlayerId);
      if (tracking) {
        tracking.stalkerIds = tracking.stalkerIds.filter((id) => id !== entityId);
      }
    }
    this.stalkerData.delete(entityId);
  }

  getPlayerTrackingData(playerId) {
    if (!this.playerTracking.has(playerId)) {
      this.playerTracking.set(playerId, {
        stalkerIds: [],
        lastSpawnAttempt: 0,
        totalDetections: 0,
        fearLevel: 0,
        lastFearDecayTick: system.currentTick,
        lastScareTick: -999999,
      });
    }
    return this.playerTracking.get(playerId);
  }

  cleanupInvalidEntities() {
    const currentTick = system.currentTick;
    if (currentTick - this.lastCleanup < 200) return;
    this.lastCleanup = currentTick;

    // Remove invalid stalker entities
    for (const [entityId, data] of this.stalkerData.entries()) {
      if (!data.entity || !data.entity.isValid) {
        this.removeStalker(entityId);
      }
    }

    // Remove tracking for players who left, also cleanup their stalkers
    const activePlayers = new Set(world.getAllPlayers().map((p) => p.id));
    for (const playerId of this.playerTracking.keys()) {
      if (!activePlayers.has(playerId)) {
        const tracking = this.playerTracking.get(playerId);
        for (const stalkerId of tracking.stalkerIds) {
          const stalkerData = this.getStalker(stalkerId);
          if (stalkerData?.entity?.isValid) {
            try { stalkerData.entity.remove(); } catch {}
          }
          this.removeStalker(stalkerId);
        }
        this.playerTracking.delete(playerId);
      }
    }
  }
}

const STATE = new StalkerState();

// ---------- MATH / HELPERS ----------

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function getDistance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function toBlockPos(pos) {
  return { x: Math.floor(pos.x), y: Math.floor(pos.y), z: Math.floor(pos.z) };
}

function safeGetBlock(dimension, pos) {
  try {
    const bp = toBlockPos(pos);
    return dimension.getBlock(bp);
  } catch {
    return undefined;
  }
}

function isSolidBlock(block) {
  // In Script API, Block has isAir and isLiquid; keep it defensive.
  if (!block) return false;
  try {
    if (block.isAir) return false;
    if (block.isLiquid) return false;
    return true;
  } catch {
    return false;
  }
}

function isAirBlock(block) {
  if (!block) return false;
  try {
    return !!block.isAir;
  } catch {
    return false;
  }
}

function calculateLookRotation(fromPos, toPos) {
  const dx = toPos.x - fromPos.x;
  const dy = toPos.y - fromPos.y;
  const dz = toPos.z - fromPos.z;
  const yaw = Math.atan2(dz, dx) * (180 / Math.PI) - 90;
  const horizontalDist = Math.sqrt(dx * dx + dz * dz);
  const pitch = -Math.atan2(dy, horizontalDist) * (180 / Math.PI);
  return { yaw, pitch };
}

function smoothRotation(currentRot, targetRot, smoothness) {
  let deltaYaw = targetRot.yaw - currentRot.x;
  while (deltaYaw > 180) deltaYaw -= 360;
  while (deltaYaw < -180) deltaYaw += 360;
  return {
    x: currentRot.x + deltaYaw * smoothness,
    y: currentRot.y + (targetRot.pitch - currentRot.y) * smoothness,
  };
}

function getPlayerViewDirection(player) {
  try {
    return player.getViewDirection();
  } catch {
    return { x: 0, y: 0, z: 1 };
  }
}

function isPlayerLookingAt(player, entityPos, threshold = 35) {
  try {
    const playerPos = player.location;
    const viewDir = player.getViewDirection();
    const toEntity = {
      x: entityPos.x - playerPos.x,
      y: entityPos.y - (playerPos.y + 1.6),
      z: entityPos.z - playerPos.z,
    };
    const dist = Math.sqrt(toEntity.x ** 2 + toEntity.y ** 2 + toEntity.z ** 2);
    if (dist === 0) return false;
    toEntity.x /= dist;
    toEntity.y /= dist;
    toEntity.z /= dist;
    const dot = viewDir.x * toEntity.x + viewDir.y * toEntity.y + viewDir.z * toEntity.z;
    const angle = Math.acos(Math.max(-1, Math.min(1, dot))) * (180 / Math.PI);
    return angle < threshold;
  } catch {
    return false;
  }
}

function getPositionBehindPlayer(player, distance) {
  const viewDir = getPlayerViewDirection(player);
  const p = player.location;
  return { x: p.x - viewDir.x * distance, y: p.y, z: p.z - viewDir.z * distance };
}

// ---------- CAVE SUPPORT ----------

function hasCeilingNearby(dimension, pos, maxDist) {
  const bp = toBlockPos(pos);
  for (let i = 1; i <= maxDist; i++) {
    const block = safeGetBlock(dimension, { x: bp.x, y: bp.y + i, z: bp.z });
    if (isSolidBlock(block)) return true;
  }
  return false;
}

function countSolidSidesAtHead(dimension, pos) {
  const bp = toBlockPos(pos);
  const y = bp.y + 1;
  const offsets = [
    { x: 1, z: 0 },
    { x: -1, z: 0 },
    { x: 0, z: 1 },
    { x: 0, z: -1 },
  ];
  let solid = 0;
  for (const o of offsets) {
    const b = safeGetBlock(dimension, { x: bp.x + o.x, y, z: bp.z + o.z });
    if (isSolidBlock(b)) solid++;
  }
  return solid;
}

function isPlayerInCave(player) {
  // "Cave" = there is a roof within CAVE_SCAN_UP blocks above the player's head
  // and at least some enclosure around head level.
  try {
    const dim = player.dimension;
    const p = player.location;
    const head = { x: p.x, y: p.y + 1.6, z: p.z };
    const roof = hasCeilingNearby(dim, head, CONFIG.CAVE_SCAN_UP);
    if (!roof) return false;

    const sides = countSolidSidesAtHead(dim, head);
    return sides >= CONFIG.CAVE_ENCLOSED_SIDE_MIN;
  } catch {
    return false;
  }
}

// ---------- SAFE SPAWN SEARCH ----------

function isSafe2BlockSpace(dimension, pos) {
  const a = safeGetBlock(dimension, pos);
  const b = safeGetBlock(dimension, { x: pos.x, y: pos.y + 1, z: pos.z });
  return isAirBlock(a) && isAirBlock(b);
}

function hasSolidFloor(dimension, pos) {
  const floor = safeGetBlock(dimension, { x: pos.x, y: pos.y - 1, z: pos.z });
  return isSolidBlock(floor);
}

function resolveSafeSpawnAtXZ(dimension, x, z, yStart, caveMode) {
  // Search down first (most common), then up.
  const bpX = Math.floor(x);
  const bpZ = Math.floor(z);
  const y0 = Math.floor(yStart);

  // Downward scan
  for (let d = 0; d <= CONFIG.VERTICAL_SEARCH_DOWN; d++) {
    const y = y0 - d;
    const pos = { x: bpX, y, z: bpZ };
    if (!hasSolidFloor(dimension, pos)) continue;
    if (!isSafe2BlockSpace(dimension, pos)) continue;
    if (caveMode) {
      if (!hasCeilingNearby(dimension, pos, CONFIG.CAVE_CEILING_MAX_DIST)) continue;
    }
    return { x: bpX + 0.5, y, z: bpZ + 0.5 };
  }

  // Upward scan
  for (let u = 1; u <= CONFIG.VERTICAL_SEARCH_UP; u++) {
    const y = y0 + u;
    const pos = { x: bpX, y, z: bpZ };
    if (!hasSolidFloor(dimension, pos)) continue;
    if (!isSafe2BlockSpace(dimension, pos)) continue;
    if (caveMode) {
      if (!hasCeilingNearby(dimension, pos, CONFIG.CAVE_CEILING_MAX_DIST)) continue;
    }
    return { x: bpX + 0.5, y, z: bpZ + 0.5 };
  }

  return undefined;
}

function getFearScaledDistances(tracking) {
  const fear = clamp(tracking.fearLevel / CONFIG.FEAR_MAX, 0, 1);
  // Higher fear -> spawn a bit closer and linger a bit closer.
  const minD = lerp(CONFIG.MIN_STALK_DISTANCE, 16, fear);
  const maxD = lerp(CONFIG.MAX_STALK_DISTANCE, 55, fear);
  const optD = lerp(CONFIG.OPTIMAL_STALK_DISTANCE, 28, fear);
  return { minD, maxD, optD };
}

function findSpawnPosition(player, preferBehind = true) {
  const dim = player.dimension;
  const p = player.location;
  const tracking = STATE.getPlayerTrackingData(player.id);
  const { minD, maxD, optD } = getFearScaledDistances(tracking);

  // Cave support: if player is in cave, use caveMode spawn rules.
  const caveMode = isPlayerInCave(player) || dim.id === "minecraft:nether";

  for (let i = 0; i < CONFIG.SPAWN_ATTEMPTS; i++) {
    let angle;
    if (preferBehind && Math.random() < CONFIG.PREFER_BEHIND_CHANCE) {
      const viewDir = getPlayerViewDirection(player);
      const viewAngle = Math.atan2(viewDir.z, viewDir.x);
      angle = viewAngle + Math.PI + (Math.random() - 0.5) * (Math.PI / 2.5);
    } else {
      angle = Math.random() * Math.PI * 2;
    }

    const distance = minD + Math.random() * (maxD - minD);
    const x = p.x + Math.cos(angle) * distance;
    const z = p.z + Math.sin(angle) * distance;
    const yOffset = Math.random() * CONFIG.SPAWN_HEIGHT_VARIANCE - 3;
    const yStart = p.y + yOffset;

    const candidate = resolveSafeSpawnAtXZ(dim, x, z, yStart, caveMode);
    if (!candidate) continue;

    // Avoid obvious spawns in front of the player.
    if (isPlayerLookingAt(player, candidate, 70)) continue;

    return candidate;
  }

  // Fallback: behind player at optimal distance, then resolve Y.
  const behind = getPositionBehindPlayer(player, optD);
  const fallback = resolveSafeSpawnAtXZ(dim, behind.x, behind.z, behind.y, caveMode);
  if (fallback && !isPlayerLookingAt(player, fallback, 80)) return fallback;

  // Absolute fallback: player's current block + 2
  return { x: Math.floor(p.x) + 0.5, y: Math.floor(p.y) + 2, z: Math.floor(p.z) + 0.5 };
}

// ---------- EFFECTS / HORROR ----------

function safeAddEffect(entity, effectId, duration, amplifier = 0) {
  try {
    const effect = EffectTypes.get(effectId);
    entity.addEffect(effect, duration, { amplifier, showParticles: false });
    return true;
  } catch {
    return false;
  }
}

function triggerJumpscare(player, stalkerData) {
  const tracking = STATE.getPlayerTrackingData(player.id);
  const now = system.currentTick;

  if (now - tracking.lastScareTick < CONFIG.JUMPSCARE_COOLDOWN_TICKS) return false;
  tracking.lastScareTick = now;

  // Blindness
  safeAddEffect(player, "blindness", CONFIG.BLINDNESS_TICKS, 0);
  // Darkness is newer; try but ignore if not available.
  safeAddEffect(player, "darkness", CONFIG.DARKNESS_TICKS, 0);

  // Audio/visual sting (optional)
  try { player.playSound("mob.endermen.stare", { volume: 0.6, pitch: 0.6 }); } catch {}
  try { player.playSound("mob.endermen.portal", { volume: 0.3, pitch: 0.5 }); } catch {}

  // Extra particles
  try {
    const pos = stalkerData.entity?.location ?? player.location;
    player.dimension.spawnParticle("minecraft:portal_directional", pos);
  } catch {}

  // Fear bump
  tracking.fearLevel = clamp(tracking.fearLevel + CONFIG.FEAR_ON_JUMPSCARE, 0, CONFIG.FEAR_MAX);

  // Vanish the stalker immediately
  try {
    if (stalkerData.entity?.isValid) stalkerData.entity.remove();
  } catch {}
  STATE.removeStalker(stalkerData.entity.id);
  return true;
}

function decayFear(player) {
  const tracking = STATE.getPlayerTrackingData(player.id);
  const now = system.currentTick;
  if (now - tracking.lastFearDecayTick < CONFIG.FEAR_DECAY_TICKS) return;
  tracking.lastFearDecayTick = now;
  tracking.fearLevel = clamp(tracking.fearLevel - CONFIG.FEAR_DECAY_AMOUNT, 0, CONFIG.FEAR_MAX);
}

// ---------- SPAWN / RELOCATE ----------

function attemptSpawnStalker(player) {
  try {
    if (!player?.isValid) return;
    const tags = player.getTags();
    if (!tags.includes(TAG_AUTO)) return;

    const tracking = STATE.getPlayerTrackingData(player.id);
    const now = system.currentTick;

    // fear decay runs on spawn-check ticks
    decayFear(player);

    if (now - tracking.lastSpawnAttempt < CONFIG.SPAWN_COOLDOWN_TICKS) return;

    // filter invalid stalker ids
    tracking.stalkerIds = tracking.stalkerIds.filter((id) => {
      const d = STATE.getStalker(id);
      return d && d.entity && d.entity.isValid;
    });

    if (tracking.stalkerIds.length >= CONFIG.MAX_STALKERS_PER_PLAYER) return;

    const spawnPos = findSpawnPosition(player, true);
    const stalker = player.dimension.spawnEntity(STALKER_ID, spawnPos);
    if (!stalker) {
      tracking.lastSpawnAttempt = now;
      return;
    }

    stalker.nameTag = "";
    STATE.registerStalker(stalker, player.id);
    tracking.stalkerIds.push(stalker.id);
    tracking.lastSpawnAttempt = now;

    // Quick invis on spawn to avoid obvious pop-in
    safeAddEffect(stalker, "invisibility", 60, 0);

    console.warn(
      `[Stalker] Spawned for ${player.name} (${player.dimension.id}) at (${Math.floor(
        spawnPos.x,
      )}, ${Math.floor(spawnPos.y)}, ${Math.floor(spawnPos.z)})`,
    );
  } catch (e) {
    console.warn(`[Stalker] Spawn error: ${e}`);
  }
}

function relocateStalker(stalkerData, player, reason = "relocate") {
  try {
    const entity = stalkerData.entity;
    if (!entity || !entity.isValid) return;
    if (!player || !player.isValid) return;

    const newPos = findSpawnPosition(player, true);
    if (!newPos) return;

    // hide while relocating
    safeAddEffect(entity, "invisibility", 40, 0);

    try {
      if (entity.dimension.id !== player.dimension.id) {
        entity.teleport(newPos, { dimension: player.dimension, rotation: entity.getRotation() });
      } else {
        entity.teleport(newPos);
      }

      stalkerData.lastRelocate = system.currentTick;
      stalkerData.consecutiveLookTicks = 0;
      stalkerData.behaviorState = reason;
      stalkerData.lastKnownDimensionId = player.dimension.id;
      stalkerData.pendingDimSwitchTick = 0;
    } catch (e) {
      // If teleport fails (can happen during dimension transitions), remove and let respawn later.
      console.warn(`[Stalker] Teleport failed (${reason}): ${e}`);
      try { entity.remove(); } catch {}
      STATE.removeStalker(entity.id);
    }
  } catch (e) {
    console.warn(`[Stalker] Relocate error: ${e}`);
  }
}

// ---------- AI UPDATE ----------

function updateStalkerAI(stalkerData, playerById) {
  try {
    const entity = stalkerData.entity;
    if (!entity || !entity.isValid) {
      if (entity?.id) STATE.removeStalker(entity.id);
      return;
    }

    const player = playerById.get(stalkerData.targetPlayerId);
    if (!player || !player.isValid) {
      try { entity.remove(); } catch {}
      STATE.removeStalker(entity.id);
      return;
    }

    const now = system.currentTick;
    stalkerData.ticksExisted++;

    // Dimension support: delayed relocate after player changes dimensions
    if (entity.dimension.id !== player.dimension.id) {
      if (!stalkerData.pendingDimSwitchTick) {
        stalkerData.pendingDimSwitchTick = now + CONFIG.DIMENSION_SWITCH_DELAY_TICKS;
        stalkerData.behaviorState = "dimension_switch";
        safeAddEffect(entity, "invisibility", CONFIG.DIMENSION_SWITCH_DELAY_TICKS, 0);
      }
      if (now >= stalkerData.pendingDimSwitchTick) {
        relocateStalker(stalkerData, player, "dimension_switch");
      }
      return;
    }

    const ePos = entity.location;
    const pPos = player.location;
    const distance = getDistance(ePos, pPos);

    // Despawn if far
    if (distance > CONFIG.DESPAWN_DISTANCE) {
      try { entity.remove(); } catch {}
      STATE.removeStalker(entity.id);
      return;
    }

    // Jumpscare if too close
    if (distance <= CONFIG.JUMPSCARE_DISTANCE) {
      const didScare = triggerJumpscare(player, stalkerData);
      if (didScare) return;
    }

    // Determine if player is looking (only do this when relevant, to save CPU)
    const beingWatched = distance < 80 ? isPlayerLookingAt(player, ePos, 35) : false;

    const tracking = STATE.getPlayerTrackingData(player.id);

    if (beingWatched) {
      stalkerData.consecutiveLookTicks++;
      stalkerData.lastPlayerLook = now;
      stalkerData.detectionCount++;

      // Fear + detections
      if (stalkerData.consecutiveLookTicks === 1) {
        tracking.totalDetections++;
        tracking.fearLevel = clamp(tracking.fearLevel + CONFIG.FEAR_ON_DETECTION, 0, CONFIG.FEAR_MAX);
      }

      if (stalkerData.consecutiveLookTicks > CONFIG.VANISH_ON_STARE_TICKS) {
        stalkerData.behaviorState = "vanishing";
        safeAddEffect(entity, "invisibility", 20, 0);
        system.runTimeout(() => {
          if (entity.isValid) relocateStalker(stalkerData, player, "vanish_relocate");
        }, 15);
        stalkerData.consecutiveLookTicks = 0;
        return;
      }

      // NOTE: Logic for "HIDE_ON_LOOK_CHANCE" disabled by config (0.0)
      if (Math.random() < CONFIG.HIDE_ON_LOOK_CHANCE && distance > 20) {
        stalkerData.behaviorState = "hiding";
        safeAddEffect(entity, "invisibility", 80, 0);
      }
    } else {
      stalkerData.consecutiveLookTicks = Math.max(0, stalkerData.consecutiveLookTicks - 2);
    }

    // Relocate if out of stalking band (throttled)
    if (distance < CONFIG.MIN_STALK_DISTANCE || distance > CONFIG.MAX_STALK_DISTANCE) {
      if (stalkerData.ticksExisted % CONFIG.TELEPORT_CHECK_INTERVAL === 0) {
        relocateStalker(stalkerData, player, "band_relocate");
        return;
      }
    }

    // Periodic relocate
    if (now - stalkerData.lastRelocate > CONFIG.RELOCATE_INTERVAL) {
      relocateStalker(stalkerData, player, "periodic_relocate");
      return;
    }

    // Face the player when stalking (lightweight)
    if (stalkerData.behaviorState === "stalking") {
      const targetRot = calculateLookRotation(ePos, { x: pPos.x, y: pPos.y + 1.6, z: pPos.z });
      const currentRot = entity.getRotation();
      entity.setRotation(smoothRotation(currentRot, targetRot, CONFIG.ROTATION_SMOOTHNESS));
    }

    // Ambience when close & not watched
    if (distance < CONFIG.DANGER_DISTANCE && !beingWatched) {
      if (Math.random() < CONFIG.AMBIENT_SOUND_CHANCE && now - stalkerData.lastSoundTick > 60) {
        try { player.playSound("ambient.cave", { volume: 0.4, pitch: 0.7 }); } catch {}
        stalkerData.lastSoundTick = now;
      }

      if (distance < 25 && Math.random() < CONFIG.WHISPER_SOUND_CHANCE) {
        try { player.playSound("mob.endermen.portal", { volume: 0.2, pitch: 0.5 }); } catch {}
      }

      if (Math.random() < CONFIG.PARTICLE_SPAWN_CHANCE) {
        try { entity.dimension.spawnParticle("minecraft:portal_directional", ePos); } catch {}
      }
    }

    // Return from hiding after player stops looking
    if (stalkerData.behaviorState === "hiding" && !beingWatched) {
      if (now - stalkerData.lastPlayerLook > 40) stalkerData.behaviorState = "stalking";
    }

    // Keep it from being pushed around
    try { entity.clearVelocity(); } catch {}
  } catch (e) {
    console.warn(`[Stalker] AI error: ${e}`);
  }
}

// ---------- SCHEDULERS (OPTIMIZATION) ----------

// AI loop (throttled)
system.runInterval(() => {
  try {
    STATE.cleanupInvalidEntities();

    // Cache players by id once per AI tick
    const players = world.getAllPlayers();
    const playerById = new Map(players.map((p) => [p.id, p]));

    const stalkers = Array.from(STATE.stalkerData.values());
    if (stalkers.length === 0) return;

    // Round-robin budget
    const budget = CONFIG.MAX_STALKER_UPDATES_PER_RUN;
    const start = STATE.roundRobinIndex % stalkers.length;
    for (let i = 0; i < Math.min(budget, stalkers.length); i++) {
      const idx = (start + i) % stalkers.length;
      updateStalkerAI(stalkers[idx], playerById);
    }
    STATE.roundRobinIndex = (start + budget) % stalkers.length;
  } catch (e) {
    console.warn(`[Stalker] System(AI) error: ${e}`);
  }
}, CONFIG.AI_UPDATE_INTERVAL);

// Spawn loop (throttled)
system.runInterval(() => {
  try {
    for (const player of world.getAllPlayers()) {
      attemptSpawnStalker(player);
    }
  } catch (e) {
    console.warn(`[Stalker] System(Spawn) error: ${e}`);
  }
}, CONFIG.SPAWN_CHECK_INTERVAL);

// ---------- CHAT COMMANDS ----------

world.beforeEvents.chatSend.subscribe((event) => {
  const player = event.sender;
  const msg = event.message.toLowerCase().trim();

  if (!msg.startsWith("!stalker")) return;
  event.cancel = true;

  const tracking = STATE.getPlayerTrackingData(player.id);

  if (msg === "!stalker on") {
    player.addTag(TAG_AUTO);
    player.sendMessage("§aStalker enabled");
    return;
  }

  if (msg === "!stalker off") {
    player.removeTag(TAG_AUTO);
    player.sendMessage("§cStalker disabled");
    return;
  }

  if (msg === "!stalker spawn") {
    player.addTag(TAG_AUTO);
    attemptSpawnStalker(player);
    player.sendMessage("§aForced stalker spawn");
    return;
  }

  if (msg === "!stalker clear") {
    let count = 0;
    for (const stalkerId of tracking.stalkerIds) {
      const data = STATE.getStalker(stalkerId);
      if (data?.entity?.isValid) {
        try { data.entity.remove(); } catch {}
        count++;
      }
      STATE.removeStalker(stalkerId);
    }
    tracking.stalkerIds = [];
    player.sendMessage(`§aRemoved ${count} stalker(s)`);
    return;
  }

  if (msg === "!stalker info") {
    const autoEnabled = player.getTags().includes(TAG_AUTO);
    let stalkerInfo = "§7No active stalker";
    if (tracking.stalkerIds.length > 0) {
      const stalkerId = tracking.stalkerIds[0];
      const data = STATE.getStalker(stalkerId);
      if (data?.entity?.isValid) {
        const dist = Math.floor(getDistance(player.location, data.entity.location));
        stalkerInfo = `§eDistance: §f${dist}m §7| State: §f${data.behaviorState}`;
      }
    }

    player.sendMessage("§7=== Stalker Info ===");
    player.sendMessage(`§7Auto Stalking: ${autoEnabled ? "§aON" : "§cOFF"}`);
    player.sendMessage(`§7Active: §e${tracking.stalkerIds.length}§7/${CONFIG.MAX_STALKERS_PER_PLAYER}`);
    player.sendMessage(`§7Fear: §d${tracking.fearLevel}§7/${CONFIG.FEAR_MAX}`);
    player.sendMessage(`§7Detections: §e${tracking.totalDetections}`);
    player.sendMessage(stalkerInfo);
    return;
  }

  player.sendMessage("§7Commands: §f!stalker on§7, §f!stalker off§7, §f!stalker spawn§7, §f!stalker clear§7, §f!stalker info");
});

console.warn("[Stalker] §aImproved stalking system loaded");

