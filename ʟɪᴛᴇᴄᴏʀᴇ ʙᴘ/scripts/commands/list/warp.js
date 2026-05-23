import { world } from "@minecraft/server"
import { registerCommand } from "../CommandRegistry.js"
import { config } from "../../config.js"
import * as db from "../../utilities/DatabaseHandler.js"
import { soundReply } from "../../utilities/SoundReply.js"
import { checkCooldown, teleportWithDelay } from "../../utilities/CoreUtils.js"

const commandInformation = { name: "warp", description: "Телепортироваться к варпу", usage: [{ name: "name", type: "String", optional: false }, { name: "player", type: "String", optional: true }] }

registerCommand(commandInformation, (origin, name, targetName) => {
  const player = origin.sourceEntity
  if (!player) return
  if (targetName && !player.hasTag(config.admin_tag)) return soundReply(player, config.No_Permission, "note.bassattack")
  const warps = db.fetch("litecore:warps", true)
  const warp = warps.find(w => w.name.toLowerCase() === name.toLowerCase())
  if (!warp) return soundReply(player, config.Warp_Not_Found.replace("%name%", name), "note.bassattack")
  if (targetName) {
    const target = world.getPlayers().find(p => p.name === targetName)
    if (!target) return soundReply(player, config.Player_Is_Null, "note.bassattack")
    teleportWithDelay(target, () => warp, () => soundReply(target, config.Teleported_Message, "mob.endermen.portal"))
    return
  }
  if (checkCooldown(player)) return
  teleportWithDelay(player, () => warp, () => soundReply(player, config.Teleported_Message, "mob.endermen.portal"))
})
