import { world } from "@minecraft/server"
import { registerCommand } from "../CommandRegistry.js"
import { config } from "../../config.js"
import * as db from "../../utilities/DatabaseHandler.js"
import { soundReply } from "../../utilities/SoundReply.js"

const commandInformation = { name: "tpadeny", description: "Отклонить запрос телепортации", usage: [{ name: "player", type: "String", optional: true }] }

registerCommand(commandInformation, (origin, fromPlayer) => {
  const player = origin.sourceEntity
  if (!player) return
  let requests = db.fetch("litecore:requests", true)
  const req = fromPlayer
    ? requests.find(d => d.receiver === player.name && d.requester === fromPlayer)
    : requests.find(d => d.receiver === player.name)
  if (!req) return soundReply(player, config.No_Teleport_Requests, "note.bassattack")
  db.store("litecore:requests", requests.filter(d => !(d.receiver === player.name && d.requester === req.requester)))
  const requester = world.getPlayers().find(p => p.name === req.requester)
  soundReply(player, config.Rejected_Receiver.replace("%player%", req.requester), "note.pling")
  if (requester) soundReply(requester, config.Rejected_Sender, "note.bassattack")
})
