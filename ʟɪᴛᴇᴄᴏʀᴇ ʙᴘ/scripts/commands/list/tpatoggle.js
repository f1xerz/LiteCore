import { registerCommand } from "../CommandRegistry.js"
import { config } from "../../config.js"
import * as db from "../../utilities/DatabaseHandler.js"
import { soundReply } from "../../utilities/SoundReply.js"

const commandInformation = { name: "tpatoggle", description: "Вкл/Выкл приём запросов", usage: [] }

registerCommand(commandInformation, (origin) => {
  const player = origin.sourceEntity
  if (!player) return
  let toggle = db.fetch("litecore:toggle", true)
  if (toggle.some(d => d.name === player.name)) {
    toggle = toggle.filter(d => d.name !== player.name)
    soundReply(player, config.TpaToggle_Activated, "note.pling")
  } else {
    toggle.push({ name: player.name })
    soundReply(player, config.TpaToggle_Deactivated, "note.pling")
  }
  db.store("litecore:toggle", toggle)
})
