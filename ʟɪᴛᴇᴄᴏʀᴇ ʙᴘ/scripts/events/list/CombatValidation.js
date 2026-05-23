import { world, system, Player } from "@minecraft/server"
import { config } from "../../config.js"

const COMBAT_TICKS = 600 // 30 секунд
const combatTimers = new Map() // playerName -> runId

function setCombat(player) {
  if (combatTimers.has(player.name)) {
    system.clearRun(combatTimers.get(player.name))
  }

  player.addTag("lite:combatlog")

  let ticksLeft = COMBAT_TICKS

  function tick() {
    const p = world.getPlayers().find(p => p.name === player.name)
    // Игрок вышел или умер (тег снят через entityDie) — стоп
    if (!p || !p.hasTag("lite:combatlog")) {
      combatTimers.delete(player.name)
      return
    }
    ticksLeft -= 20
    if (ticksLeft <= 0) {
      p.removeTag("lite:combatlog")
      combatTimers.delete(player.name)
      try { p.onScreenDisplay.setActionBar("") } catch {}
      return
    }
    const secsLeft = Math.ceil(ticksLeft / 20)
    try {
      p.onScreenDisplay.setActionBar(
        config.Combat_Actionbar.replace("%время%", secsLeft)
      )
    } catch {}
    combatTimers.set(player.name, system.runTimeout(tick, 20))
  }

  combatTimers.set(player.name, system.runTimeout(tick, 20))
}

// Выдаём тег обоим при ударе
world.afterEvents.entityHurt.subscribe((event) => {
  if (!(event.hurtEntity instanceof Player)) return
  const attacker = event.damageSource?.damagingEntity
  if (!(attacker instanceof Player)) return

  system.run(() => {
    setCombat(event.hurtEntity)
    setCombat(attacker)
  })
})

// Снимаем тег при смерти
world.afterEvents.entityDie.subscribe((event) => {
  if (!(event.deadEntity instanceof Player)) return
  const player = event.deadEntity
  const name = player.name

  // Останавливаем таймер
  if (combatTimers.has(name)) {
    system.clearRun(combatTimers.get(name))
    combatTimers.delete(name)
  }

  // Снимаем тег через system.run (afterEvent)
  system.run(() => {
    try {
      if (player.hasTag("lite:combatlog")) player.removeTag("lite:combatlog")
      player.onScreenDisplay.setActionBar("")
    } catch {}
  })
})

// Блок команд во время ПвП-режима
world.beforeEvents.chatSend.subscribe((event) => {
  const player = event.sender
  if (!player.hasTag("lite:combatlog")) return
  const msg = event.message.trim()
  if (!msg.startsWith(`${config.commands.namespace}:`)) return
  event.cancel = true
  system.run(() => {
    try {
      player.sendMessage(`${config.prefix} §cВы не можете использовать команды во время ПвП-режима!`)
      player.playSound("note.bassattack")
    } catch {}
  })
})
