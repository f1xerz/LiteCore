import { world, system } from "@minecraft/server"
import { config } from "../config.js"
import { soundReply } from "./SoundReply.js"

export const activeTeleports = new Map()

export function getDelay(player) {
  for (const entry of config.delay_teleport) {
    if (player.hasTag(entry.tag)) return entry.delay
  }
  return config.default_delay
}

export function doTeleportWithDelay(player, targetGetter, onSuccess, onCancel) {
  const delay = getDelay(player)

  if (activeTeleports.has(player.id)) {
    system.clearRun(activeTeleports.get(player.id))
    activeTeleports.delete(player.id)
  }

  if (delay === 0) {
    system.run(() => {
      const target = targetGetter()
      if (!target) return onCancel?.()
      player.teleport(target.location, { dimension: target.dimension, keepVelocity: false })
      onSuccess?.()
    })
    return
  }

  system.run(() => {
    player.onScreenDisplay.setActionBar(
      config.Actionbar.replace("%time%", delay)
    )
  })

  let ticksLeft = delay * 20

  function tick() {
    const online = world.getPlayers().find(p => p.id === player.id)
    if (!online) { activeTeleports.delete(player.id); return }

    if (player.hasTag("lite:hurted")) {
      activeTeleports.delete(player.id)
      system.run(() => {
        player.sendMessage(`${config.prefix} ${config.Damaged_Cancel_Message}`)
        player.playSound("note.bassattack")
      })
      return
    }

    ticksLeft -= 20

    if (ticksLeft <= 0) {
      activeTeleports.delete(player.id)
      system.run(() => {
        const target = targetGetter()
        if (!target) return onCancel?.()
        player.teleport(target.location, { dimension: target.dimension, keepVelocity: false })
        onSuccess?.()
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

export function checkCooldown(player, cooldowns) {
  const cd = cooldowns.get(player.id)
  if (cd && system.currentTick < cd) {
    const secsLeft = Math.ceil((cd - system.currentTick) / 20)
    soundReply(player, config.Cooldown_Message.replace("%time%", secsLeft), "note.bassattack")
    return true
  }
  cooldowns.set(player.id, system.currentTick + config.commands.cooldown * 20)
  return false
}
