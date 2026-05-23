import { world } from "@minecraft/server"
import { registerCommand } from "../CommandRegistry.js"
import { config } from "../../config.js"
import * as db from "../../utilities/DatabaseHandler.js"
import { soundReply } from "../../utilities/SoundReply.js"

const commandInformation = { name: "tpaignore", description: "Игнорировать запросы от игрока", usage: [{ name: "player", type: "String", optional: false }] }

registerCommand(commandInformation, (origin, target) => {
  const player = origin.sourceEntity
  if (!player) return
  const targetPlayer = world.getPlayers().find(p => p.name === target)
  if (!targetPlayer) return soundReply(player, config.Player_Is_Null, "note.bassattack")
  if (player.name === targetPlayer.name) return soundReply(player, config.TpaIgnore_Is_Player, "note.bassattack")
  let ignore = db.fetch("litecore:ignore", true)
  if (!ignore.some(d => d.blocker === player.name && d.blockedUser === targetPlayer.name)) {
    ignore.push({ blocker: player.name, blockedUser: targetPlayer.name })
    soundReply(player, config.Player_Is_Ignored, "note.pling")
  } else {
    ignore = ignore.filter(d => !(d.blocker === player.name && d.blockedUser === targetPlayer.name))
    soundReply(player, config.Player_Unignored, "note.pling")
  }
  db.store("litecore:ignore", ignore)
})
