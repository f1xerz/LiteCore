import { registerCommand } from "../CommandRegistry.js"
import { config } from "../../config.js"
import * as db from "../../utilities/DatabaseHandler.js"
import { soundReply } from "../../utilities/SoundReply.js"

const commandInformation = { name: "warps", description: "Список варпов", usage: [] }

registerCommand(commandInformation, (origin) => {
  const player = origin.sourceEntity
  if (!player) return
  const warps = db.fetch("litecore:warps", true)
  if (warps.length === 0) return soundReply(player, config.Warps_Empty, "note.bassattack")
  const list = warps.map((w, i) => `§7${i + 1}. §b${w.name} §8(${Math.floor(w.x)}, ${Math.floor(w.y)}, ${Math.floor(w.z)} — ${w.dimension.replace("minecraft:", "")})`).join("\n")
  player.sendMessage(`${config.prefix} ${config.Warps_List.replace("%count%", warps.length)}\n${list}`)
})
