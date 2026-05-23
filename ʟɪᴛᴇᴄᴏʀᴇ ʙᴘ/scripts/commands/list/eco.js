import { world } from "@minecraft/server"
import { registerCommand } from "../CommandRegistry.js"
import { config } from "../../config.js"
import { soundReply } from "../../utilities/SoundReply.js"
import { getMoney, setMoney, addMoney } from "../../utilities/CoreUtils.js"

const commandInformation = { name: "eco", description: "Управление балансом", usage: [{ name: "action", type: "String", optional: false }, { name: "player", type: "String", optional: false }, { name: "amount", type: "Integer", optional: true }] }

registerCommand(commandInformation, (origin, action, targetName, amount = 0) => {
  const player = origin.sourceEntity
  if (!player) return
  if (!player.hasTag(config.admin_tag)) return soundReply(player, config.No_Permission, "note.bassattack")
  const target = world.getPlayers().find(p => p.name === targetName)
  if (!target) return soundReply(player, config.Player_Is_Null, "note.bassattack")

  // amount может прийти строкой из парсера — приводим к числу
  const num = parseInt(amount)
  if (isNaN(num)) return soundReply(player, "§cНеверная сумма!", "note.bassattack")

  const act = action.toLowerCase()
  if (act === "give") {
    addMoney(target, num)
    soundReply(player, config.Eco_Give.replace("%player%", target.name).replace("%amount%", num), "note.pling")
  } else if (act === "take") {
    addMoney(target, -num)
    soundReply(player, config.Eco_Take.replace("%player%", target.name).replace("%amount%", num), "note.pling")
  } else if (act === "set") {
    setMoney(target, num)
    soundReply(player, config.Eco_Set.replace("%player%", target.name).replace("%amount%", num), "note.pling")
  } else if (act === "reset") {
    setMoney(target, 0)
    soundReply(player, config.Eco_Reset.replace("%player%", target.name), "note.pling")
  }
})
