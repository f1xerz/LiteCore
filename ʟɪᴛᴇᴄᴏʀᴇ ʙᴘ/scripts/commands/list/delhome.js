import { world } from "@minecraft/server"
import { registerCommand } from "../CommandRegistry.js"
import { config } from "../../config.js"
import * as db from "../../utilities/DatabaseHandler.js"
import { soundReply } from "../../utilities/SoundReply.js"

const commandInformation = { name: "delhome", description: "Удалить дом", usage: [{ name: "name", type: "String", optional: false }, { name: "player", type: "String", optional: true }] }

registerCommand(commandInformation, (origin, name, targetName) => {
  const player = origin.sourceEntity
  if (!player) return
  if (targetName && !player.hasTag(config.admin_tag)) return soundReply(player, config.No_Permission, "note.bassattack")
  const targetPlayerName = targetName ?? player.name
  let homes = db.fetch(`litecore:homes:${targetPlayerName}`, true)
  if (!homes.some(h => h.name === name)) return soundReply(player, config.Home_Not_Found.replace("%name%", name), "note.bassattack")
  db.store(`litecore:homes:${targetPlayerName}`, homes.filter(h => h.name !== name))
  soundReply(player, config.Home_Deleted.replace("%name%", name), "note.pling")
})
