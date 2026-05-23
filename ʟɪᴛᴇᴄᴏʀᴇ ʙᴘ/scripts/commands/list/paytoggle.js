import { world } from "@minecraft/server"
import { registerCommand } from "../CommandRegistry.js"
import { config } from "../../config.js"
import * as db from "../../utilities/DatabaseHandler.js"
import { soundReply } from "../../utilities/SoundReply.js"

const commandInformation = { name: "paytoggle", description: "Вкл/выкл получение переводов", usage: [{ name: "player", type: "String", optional: true }] }

registerCommand(commandInformation, (origin, targetName) => {
  const player = origin.sourceEntity
  if (!player) return
  if (targetName && !player.hasTag(config.admin_tag)) return soundReply(player, config.No_Permission, "note.bassattack")
  const target = targetName ? world.getPlayers().find(p => p.name === targetName) : player
  if (!target) return soundReply(player, config.Player_Is_Null, "note.bassattack")
  let pt = db.fetch("litecore:paytoggle", true)
  if (pt.some(d => d.name === target.name)) {
    pt = pt.filter(d => d.name !== target.name)
    soundReply(player, config.Pay_Toggle_On, "note.pling")
  } else {
    pt.push({ name: target.name })
    soundReply(player, config.Pay_Toggle_Off, "note.pling")
  }
  db.store("litecore:paytoggle", pt)
})
