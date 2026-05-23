import { system } from "@minecraft/server"
import { registerCommand } from "../CommandRegistry.js"
import { config } from "../../config.js"
import * as db from "../../utilities/DatabaseHandler.js"
import { soundReply } from "../../utilities/SoundReply.js"

const commandInformation = { name: "setwarp", description: "Создать варп", usage: [{ name: "name", type: "String", optional: false }] }

registerCommand(commandInformation, (origin, name) => {
  const player = origin.sourceEntity
  if (!player) return
  if (!player.hasTag(config.admin_tag)) return soundReply(player, config.No_Permission, "note.bassattack")
  const warps = db.fetch("litecore:warps", true)
  if (warps.some(w => w.name.toLowerCase() === name.toLowerCase())) return soundReply(player, config.Warp_Already_Exists.replace("%name%", name), "note.bassattack")
  system.run(() => {
    const loc = player.location, rot = player.getRotation()
    warps.push({ name, x: Math.floor(loc.x * 100) / 100, y: Math.floor(loc.y * 100) / 100, z: Math.floor(loc.z * 100) / 100, rx: rot.x, ry: rot.y, dimension: player.dimension.id })
    db.store("litecore:warps", warps)
    soundReply(player, config.Warp_Set.replace("%name%", name), "note.pling")
  })
})
