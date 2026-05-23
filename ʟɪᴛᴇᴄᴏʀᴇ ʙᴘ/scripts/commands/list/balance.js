import { world } from "@minecraft/server"
import { registerCommand } from "../CommandRegistry.js"
import { config } from "../../config.js"
import { soundReply } from "../../utilities/SoundReply.js"
import { getMoney } from "../../utilities/CoreUtils.js"

const commandInformation = { name: "balance", description: "Баланс игрока", aliases: ["bal"], usage: [{ name: "player", type: "String", optional: true }] }

registerCommand(commandInformation, (origin, targetName) => {
  const player = origin.sourceEntity
  if (!player) return
  if (targetName && !player.hasTag(config.admin_tag)) return soundReply(player, config.No_Permission, "note.bassattack")
  const target = targetName ? world.getPlayers().find(p => p.name === targetName) : player
  if (!target) return soundReply(player, config.Player_Is_Null, "note.bassattack")
  player.sendMessage(`${config.prefix} ${config.Balance_Message.replace("%player%", target.name).replace("%balance%", getMoney(target))}`)
})
