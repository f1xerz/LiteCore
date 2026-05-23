import { system } from "@minecraft/server"
import { registerCommand } from "../CommandRegistry.js"
import { config } from "../../config.js"
import * as db from "../../utilities/DatabaseHandler.js"
import { soundReply } from "../../utilities/SoundReply.js"

const commandInformation = { name: "setspawn", description: "Установить спавн", usage: [] }

registerCommand(commandInformation, (origin) => {
  const player = origin.sourceEntity
  if (!player) return
  if (!player.hasTag(config.admin_tag)) return soundReply(player, config.No_Permission, "note.bassattack")
  system.run(() => {
    const loc = player.location, rot = player.getRotation()
    db.store("litecore:spawn", { x: Math.floor(loc.x * 100) / 100, y: Math.floor(loc.y * 100) / 100, z: Math.floor(loc.z * 100) / 100, rx: rot.x, ry: rot.y, dimension: player.dimension.id })
    soundReply(player, config.Spawn_Set, "note.pling")
  })
})
