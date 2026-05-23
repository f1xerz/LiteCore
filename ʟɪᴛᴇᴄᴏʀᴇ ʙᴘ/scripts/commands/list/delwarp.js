import { registerCommand } from "../CommandRegistry.js"
import { config } from "../../config.js"
import * as db from "../../utilities/DatabaseHandler.js"
import { soundReply } from "../../utilities/SoundReply.js"

const commandInformation = { name: "delwarp", description: "Удалить варп", usage: [{ name: "name", type: "String", optional: false }] }

registerCommand(commandInformation, (origin, name) => {
  const player = origin.sourceEntity
  if (!player) return
  if (!player.hasTag(config.admin_tag)) return soundReply(player, config.No_Permission, "note.bassattack")
  let warps = db.fetch("litecore:warps", true)
  if (!warps.some(w => w.name.toLowerCase() === name.toLowerCase())) return soundReply(player, config.Warp_Not_Found.replace("%name%", name), "note.bassattack")
  db.store("litecore:warps", warps.filter(w => w.name.toLowerCase() !== name.toLowerCase()))
  soundReply(player, config.Warp_Deleted.replace("%name%", name), "note.pling")
})
