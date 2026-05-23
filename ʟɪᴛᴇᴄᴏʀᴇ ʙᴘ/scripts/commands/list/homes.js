import { world } from "@minecraft/server"
import { registerCommand } from "../CommandRegistry.js"
import { config } from "../../config.js"
import * as db from "../../utilities/DatabaseHandler.js"
import { soundReply } from "../../utilities/SoundReply.js"

const commandInformation = { name: "homes", description: "Список домов", usage: [{ name: "player", type: "String", optional: true }] }

registerCommand(commandInformation, (origin, targetName) => {
  const player = origin.sourceEntity
  if (!player) return
  if (targetName && !player.hasTag(config.admin_tag)) return soundReply(player, config.No_Permission, "note.bassattack")
  const targetPlayerName = targetName ?? player.name
  const homes = db.fetch(`litecore:homes:${targetPlayerName}`, true)
  if (homes.length === 0) return soundReply(player, config.Homes_Empty, "note.bassattack")
  const list = homes.map((h, i) => `§7${i + 1}. §b${h.name} §8(${Math.floor(h.x)}, ${Math.floor(h.y)}, ${Math.floor(h.z)} — ${h.dimension.replace("minecraft:", "")})`).join("\n")
  player.sendMessage(`${config.prefix} ${config.Homes_List.replace("%player%", targetPlayerName).replace("%count%", homes.length)}\n${list}`)
})
