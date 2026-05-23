import { world, system } from "@minecraft/server"
import { registerCommand } from "../CommandRegistry.js"
import { config } from "../../config.js"
import { soundReply } from "../../utilities/SoundReply.js"

const commandInformation = {
  name: "gm",
  description: "Изменить игровой режим",
  usage: [
    { name: "mode", type: "String", optional: false },
    { name: "player", type: "String", optional: true }
  ]
}

const modeMap = {
  "survival": "survival",   "s": "survival",
  "creative": "creative",   "c": "creative",
  "adventure": "adventure", "a": "adventure",
  "spectator": "spectator", "sp": "spectator",
}

const modeName = {
  "survival": "Survival", "creative": "Creative",
  "adventure": "Adventure", "spectator": "Spectator",
}

registerCommand(commandInformation, (origin, mode, targetName) => {
  const player = origin.sourceEntity
  if (!player) return
  if (!player.hasTag(config.admin_tag)) return soundReply(player, config.No_Permission, "note.bassattack")
  if (targetName && !player.hasTag(config.admin_tag)) return soundReply(player, config.No_Permission, "note.bassattack")

  const key = String(mode ?? "").toLowerCase().trim()
  const gmMode = modeMap[key]

  if (!gmMode) return soundReply(player, config.Gm_Available, "note.bassattack")

  const target = targetName ? world.getPlayers().find(p => p.name === targetName) : player
  if (!target) return soundReply(player, config.Player_Is_Null, "note.bassattack")

  system.run(() => {
    target.runCommand(`gamemode ${gmMode} @s`)
    soundReply(player, config.Gm_Changed.replace("%player%", target.name).replace("%mode%", modeName[gmMode]), "note.pling")
  })
})
