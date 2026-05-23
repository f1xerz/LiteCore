import { world } from "@minecraft/server"
import { registerCommand } from "../CommandRegistry.js"
import { config } from "../../config.js"
import * as db from "../../utilities/DatabaseHandler.js"
import { soundReply } from "../../utilities/SoundReply.js"
import { getMoney, setMoney } from "../../utilities/CoreUtils.js"

const commandInformation = { name: "pay", description: "Перевести деньги", usage: [{ name: "player", type: "String", optional: false }, { name: "amount", type: "Integer", optional: false }] }

registerCommand(commandInformation, (origin, targetName, amount) => {
  const player = origin.sourceEntity
  if (!player) return
  const num = parseInt(amount)
  if (isNaN(num) || num <= 0) return soundReply(player, "§cНеверная сумма!", "note.bassattack")
  if (player.name === targetName) return soundReply(player, config.Pay_Is_Playerd, "note.bassattack")
  const target = world.getPlayers().find(p => p.name === targetName)
  if (!target) return soundReply(player, config.Player_Is_Null, "note.bassattack")
  const paytoggle = db.fetch("litecore:paytoggle", true)
  if (paytoggle.some(d => d.name === target.name)) return soundReply(player, config.Pay_Toggled_Off, "note.bassattack")
  const balance = getMoney(player)
  if (balance < num) return soundReply(player, config.Pay_Not_Enough, "note.bassattack")
  setMoney(player, balance - num)
  setMoney(target, getMoney(target) + num)
  soundReply(player, config.Pay_Success.replace("%player%", target.name).replace("%amount%", num), "note.pling")
  soundReply(target, config.Pay_Received.replace("%player%", player.name).replace("%amount%", num), "note.pling")
})
