import { world } from "@minecraft/server"
import { registerCommand } from "../CommandRegistry.js"
import { config } from "../../config.js"
import * as db from "../../utilities/DatabaseHandler.js"
import { soundReply } from "../../utilities/SoundReply.js"

const commandInformation = {
  name: "renamehome",
  description: "Переименовать точку дома",
  usage: [
    { name: "name",    type: "String", optional: false },
    { name: "newname", type: "String", optional: false },
    { name: "player",  type: "String", optional: true  }
  ]
}

registerCommand(commandInformation, (origin, name, newname, targetName) => {
  const player = origin.sourceEntity
  if (!player) return
  if (targetName && !player.hasTag(config.admin_tag)) return soundReply(player, config.No_Permission, "note.bassattack")

  const targetPlayerName = targetName ?? player.name
  const homes = db.fetch(`litecore:homes:${targetPlayerName}`, true)
  const home = homes.find(h => h.name === name)

  if (!home) return soundReply(player, config.Home_Not_Found.replace("%name%", name), "note.bassattack")
  if (homes.some(h => h.name === newname)) return soundReply(player, config.Home_Already_Exists.replace("%name%", newname), "note.bassattack")

  home.name = newname
  db.store(`litecore:homes:${targetPlayerName}`, homes)
  soundReply(player, config.Home_Renamed.replace("%old%", name).replace("%new%", newname), "note.pling")
})
