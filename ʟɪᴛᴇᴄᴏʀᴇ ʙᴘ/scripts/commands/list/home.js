import { world } from "@minecraft/server"
import { registerCommand } from "../CommandRegistry.js"
import { config } from "../../config.js"
import * as db from "../../utilities/DatabaseHandler.js"
import { soundReply } from "../../utilities/SoundReply.js"
import { checkCooldown, teleportWithDelay } from "../../utilities/CoreUtils.js"

const commandInformation = { name: "home", description: "Телепортироваться домой", usage: [{ name: "name", type: "String", optional: false }, { name: "player", type: "String", optional: true }] }

registerCommand(commandInformation, (origin, name, targetName) => {
  const player = origin.sourceEntity
  if (!player) return
  if (targetName && !player.hasTag(config.admin_tag)) return soundReply(player, config.No_Permission, "note.bassattack")
  const targetPlayerName = targetName ?? player.name
  const homes = db.fetch(`litecore:homes:${targetPlayerName}`, true)
  const home = homes.find(h => h.name === name)
  if (!home) return soundReply(player, config.Home_Not_Found.replace("%name%", name), "note.bassattack")
  if (checkCooldown(player)) return
  teleportWithDelay(player, () => home, () => soundReply(player, config.Teleported_Message, "mob.endermen.portal"))
})
