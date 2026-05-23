import { world } from "@minecraft/server"
import { registerCommand } from "../CommandRegistry.js"
import { config } from "../../config.js"
import * as db from "../../utilities/DatabaseHandler.js"
import { soundReply } from "../../utilities/SoundReply.js"
import { checkCooldown, teleportWithDelay } from "../../utilities/CoreUtils.js"

const commandInformation = { name: "spawn", description: "Телепортироваться на спавн", usage: [{ name: "player", type: "String", optional: true }] }

registerCommand(commandInformation, (origin, targetName) => {
  const player = origin.sourceEntity
  if (!player) return
  if (targetName && !player.hasTag(config.admin_tag)) return soundReply(player, config.No_Permission, "note.bassattack")
  const spawnData = db.fetch("litecore:spawn")
  if (!spawnData) return soundReply(player, config.Spawn_No_Point, "note.bassattack")
  const target = targetName ? world.getPlayers().find(p => p.name === targetName) : player
  if (!target) return soundReply(player, config.Player_Is_Null, "note.bassattack")
  if (checkCooldown(player)) return
  teleportWithDelay(target, () => spawnData, () => soundReply(target, config.Teleported_Message, "mob.endermen.portal"))
})
