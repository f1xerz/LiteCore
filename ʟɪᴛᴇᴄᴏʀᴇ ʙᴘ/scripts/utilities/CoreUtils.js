import { world, system } from "@minecraft/server"
import { config } from "../config.js"
import { soundReply } from "./SoundReply.js"

export const activeTeleports = new Map()

// Авто-создание scoreboard при загрузке мира
system.run(() => {
  try {
    if (!world.scoreboard.getObjective(config.money_scoreboard)) {
      world.scoreboard.addObjective(config.money_scoreboard, config.money_scoreboard)
    }
  } catch {}
})

export function getDelay(player) {
  for (const entry of config.delay_teleport) {
    if (player.hasTag(entry.tag)) return entry.delay
  }
  return config.default_delay
}

export function getMaxHomes(player) {
  for (const entry of config.max_homes) {
    if (player.hasTag(entry.tag)) return entry.limit
  }
  return config.default_max_homes
}

// Единый кулдаун
const cooldowns = new Map()
export function checkCooldown(player) {
  if (player.hasTag(config.admin_tag)) return false
  const cd = cooldowns.get(player.id)
  if (cd && system.currentTick < cd) {
    const secsLeft = Math.ceil((cd - system.currentTick) / 20)
    soundReply(player, config.Cooldown_Message.replace("%time%", secsLeft), "note.bassattack")
    return true
  }
  cooldowns.set(player.id, system.currentTick + config.commands.cooldown * 20)
  return false
}

// Телепортация с задержкой
export function teleportWithDelay(player, getTarget, onSuccess, onFail) {
  const delay = getDelay(player)

  if (activeTeleports.has(player.id)) {
    system.clearRun(activeTeleports.get(player.id))
    activeTeleports.delete(player.id)
  }

  if (delay === 0) {
    system.run(() => {
      const target = getTarget()
      if (!target) { onFail?.(); return }
      doTeleport(player, target)
      onSuccess?.()
    })
    return
  }

  system.run(() => {
    player.onScreenDisplay.setActionBar(config.Actionbar.replace("%time%", delay))
  })

  let ticksLeft = delay * 20

  function tick() {
    if (!world.getPlayers().find(p => p.id === player.id)) {
      activeTeleports.delete(player.id); return
    }
    if (player.hasTag("lite:combatlog")) {
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
        const target = getTarget()
        if (!target) { onFail?.(); return }
        doTeleport(player, target)
        onSuccess?.()
      })
      return
    }
    const secsLeft = Math.ceil(ticksLeft / 20)
    system.run(() => player.onScreenDisplay.setActionBar(config.Actionbar.replace("%time%", secsLeft)))
    activeTeleports.set(player.id, system.runTimeout(tick, 20))
  }

  activeTeleports.set(player.id, system.runTimeout(tick, 20))
}

function doTeleport(player, target) {
  try {
    if (target.location !== undefined) {
      player.teleport(target.location, { dimension: target.dimension, keepVelocity: false })
    } else {
      const dim = world.getDimension(target.dimension)
      player.teleport(
        { x: target.x, y: target.y, z: target.z },
        { dimension: dim, rotation: { x: target.rx ?? 0, y: target.ry ?? 0 }, keepVelocity: false }
      )
    }
  } catch (e) {
    player.sendMessage(`§cОшибка: ${e}`)
  }
}

// Scoreboard / деньги
export function getMoney(player) {
  try {
    let obj = world.scoreboard.getObjective(config.money_scoreboard)
    if (!obj) obj = world.scoreboard.addObjective(config.money_scoreboard, config.money_scoreboard)
    try {
      return obj.getScore(player) ?? 0
    } catch { return 0 }
  } catch { return 0 }
}

export function setMoney(player, amount) {
  try {
    let obj = world.scoreboard.getObjective(config.money_scoreboard)
    if (!obj) obj = world.scoreboard.addObjective(config.money_scoreboard, config.money_scoreboard)
    obj.addScore(player, Math.round(amount) - (obj.getScore(player) ?? 0))
  } catch {}
}

export function addMoney(player, amount) {
  setMoney(player, getMoney(player) + amount)
}
