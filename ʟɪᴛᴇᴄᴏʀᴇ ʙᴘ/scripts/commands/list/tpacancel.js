import { world } from "@minecraft/server"
import { registerCommand } from "../CommandRegistry.js"
import { config } from "../../config.js"
import * as db from "../../utilities/DatabaseHandler.js"
import { soundReply } from "../../utilities/SoundReply.js"

const commandInformation = { name: "tpacancel", description: "Отменить свой запрос", usage: [] }

registerCommand(commandInformation, (origin) => {
  const player = origin.sourceEntity
  if (!player) return
  let requests = db.fetch("litecore:requests", true)
  const req = requests.find(d => d.requester === player.name)
  if (!req) return soundReply(player, config.No_Teleport_Requests, "note.bassattack")
  db.store("litecore:requests", requests.filter(d => d.requester !== player.name))
  soundReply(player, config.Request_Cancelled, "note.pling")
})
