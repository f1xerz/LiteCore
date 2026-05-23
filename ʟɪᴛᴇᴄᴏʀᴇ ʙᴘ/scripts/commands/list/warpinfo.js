import { registerCommand } from "../CommandRegistry.js"
import { config } from "../../config.js"
import * as db from "../../utilities/DatabaseHandler.js"
import { soundReply } from "../../utilities/SoundReply.js"

const commandInformation = { name: "warpinfo", description: "Информация о варпе", usage: [{ name: "name", type: "String", optional: false }] }

registerCommand(commandInformation, (origin, name) => {
  const player = origin.sourceEntity
  if (!player) return
  const warps = db.fetch("litecore:warps", true)
  const warp = warps.find(w => w.name.toLowerCase() === name.toLowerCase())
  if (!warp) return soundReply(player, config.Warp_Not_Found.replace("%name%", name), "note.bassattack")
  player.sendMessage(`${config.prefix} ${config.Warp_Info.replace("%name%", warp.name).replace("%x%", Math.floor(warp.x)).replace("%y%", Math.floor(warp.y)).replace("%z%", Math.floor(warp.z)).replace("%dim%", warp.dimension.replace("minecraft:", ""))}`)
})
