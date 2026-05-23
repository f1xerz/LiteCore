import { world, system } from "@minecraft/server"
import { registerCommand } from "../CommandRegistry.js"
import { config } from "../../config.js"
import * as db from "../../utilities/DatabaseHandler.js"
import { soundReply } from "../../utilities/SoundReply.js"
import { getMaxHomes } from "../../utilities/CoreUtils.js"

const commandInformation = { name: "sethome", description: "Установить дом", usage: [{ name: "name", type: "String", optional: false }, { name: "player", type: "String", optional: true }] }

registerCommand(commandInformation, (origin, name, targetName) => {
  const player = origin.sourceEntity
  if (!player) return
  if (targetName && !player.hasTag(config.admin_tag)) return soundReply(player, config.No_Permission, "note.bassattack")
  const targetPlayer = targetName ? world.getPlayers().find(p => p.name === targetName) : player
  if (!targetPlayer) return soundReply(player, config.Player_Is_Null, "note.bassattack")
  const homes = db.fetch(`litecore:homes:${targetPlayer.name}`, true)
  const max = getMaxHomes(targetPlayer)
  if (max > 0 && homes.length >= max) return soundReply(player, config.Max_Homes_Reached.replace("%current%", homes.length).replace("%max%", max), "note.bassattack")
  if (homes.some(h => h.name === name)) return soundReply(player, config.Home_Already_Exists.replace("%name%", name), "note.bassattack")
  system.run(() => {
    const loc = targetPlayer.location, rot = targetPlayer.getRotation()
    homes.push({ name, x: Math.floor(loc.x * 100) / 100, y: Math.floor(loc.y * 100) / 100, z: Math.floor(loc.z * 100) / 100, rx: rot.x, ry: rot.y, dimension: targetPlayer.dimension.id })
    db.store(`litecore:homes:${targetPlayer.name}`, homes)
    soundReply(player, config.Home_Set.replace("%name%", name), "note.pling")
  })
})
