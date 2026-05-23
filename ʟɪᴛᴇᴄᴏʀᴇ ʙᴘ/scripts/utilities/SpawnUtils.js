import { world, system } from "@minecraft/server"
import { config } from "../config.js"
import { soundReply } from "./SoundReply.js"

export const activeTeleports = new Map()
export const cooldowns = new Map()

export function getDelay(player) {
  for (const entry of config.delay_teleport) {
    if (player.hasTag(entry.tag)) return entry.delay
  }
  return config.default_delay
}

export function checkCooldown(player) {
  if (config.commands.cooldown <= 0 || player.hasTag(config.admin_tag)) return false
  const cd = cooldowns.get(player.id)
  if (cd && system.currentTick < cd) {
    const secsLeft = Math.ceil((cd - system.currentTick) / 20)
    soundReply(player, config.Cooldown_Message.replace("%time%", secsLeft), "note.bassattack")
    return true
  }
  return false
}

export function setCooldown(player) {
  if (config.commands.cooldown > 0 && !player.hasTag(config.admin_tag)) {
    cooldowns.set(player.id, system.currentTick + config.commands.cooldown * 20)
  }
}

export function doTeleport(player, spawnData) {
  try {
    const dim = world.getDimension(spawnData.dimension)
    player.teleport(
      { x: spawnData.x, y: spawnData.y, z: spawnData.z },
      {
        dimension: dim,
        rotation: { x: spawnData.rx ?? 0, y: spawnData.ry ?? 0 },
        keepVelocity: false
      }
    )
  } catch (e) {
    player.sendMessage(`§cОшибка телепортации: ${e}`)
  }
}

export function teleportToSpawn(player, spawnData) {
  const delay = getDelay(player)

  if (activeTeleports.has(player.id)) {
    system.clearRun(activeTeleports.get(player.id))
    activeTeleports.delete(player.id)
  }

  if (delay === 0) {
    system.run(() => {
      doTeleport(player, spawnData)
      setCooldown(player)
      soundReply(player, config.Teleported_Message, "mob.endermen.portal")
    })
    return
  }

  let ticksLeft = delay * 20

  system.run(() => {
    player.onScreenDisplay.setActionBar(
      config.Actionbar.replace("%time%", delay)
    )
  })

  function tick() {
    const online = world.getPlayers().find(p => p.id === player.id)
    if (!online) { activeTeleports.delete(player.id); return }

    if (player.hasTag("lite:hurted")) {
      activeTeleports.delete(player.id)
      system.run(() => {
        player.onScreenDisplay.setActionBar(config.Actionbar_Cancel)
        player.sendMessage(`${config.prefix} ${config.Damaged_Cancel_Message}`)
        player.playSound("note.bassattack")
      })
      return
    }

    ticksLeft -= 20

    if (ticksLeft <= 0) {
      activeTeleports.delete(player.id)
      system.run(() => {
        doTeleport(player, spawnData)
        setCooldown(player)
        soundReply(player, config.Teleported_Message, "mob.endermen.portal")
      })
      return
    }

    const secsLeft = Math.ceil(ticksLeft / 20)
    system.run(() => {
      player.onScreenDisplay.setActionBar(
        config.Actionbar.replace("%time%", secsLeft)
      )
    })

    const id = system.runTimeout(tick, 20)
    activeTeleports.set(player.id, id)
  }

  const id = system.runTimeout(tick, 20)
  activeTeleports.set(player.id, id)
}
