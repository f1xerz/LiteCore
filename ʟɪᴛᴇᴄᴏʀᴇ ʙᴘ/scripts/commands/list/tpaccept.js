import { world, system } from "@minecraft/server"
import { registerCommand } from "../CommandRegistry.js"
import { config } from "../../config.js"
import * as db from "../../utilities/DatabaseHandler.js"
import { soundReply } from "../../utilities/SoundReply.js"
import { teleportWithDelay } from "../../utilities/CoreUtils.js"

const commandInformation = { name: "tpaccept", description: "Принять запрос телепортации", usage: [{ name: "player", type: "String", optional: true }] }

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
  if (!requester) return soundReply(player, config.Invalid_Player, "note.bassattack")
  system.run(() => {
    requester.sendMessage(`${config.prefix} ${config.Teleport_Accepted_Sender.replace("%player%", player.name)}`)
    player.sendMessage(`${config.prefix} ${config.Teleport_Accepted_Receiver.replace("%player%", requester.name)}`)
  })
  if (req.type === "tpa") {
    teleportWithDelay(requester, () => world.getPlayers().find(p => p.name === player.name),
      () => soundReply(requester, config.Teleported_Message, "mob.endermen.portal"))
  } else {
    teleportWithDelay(player, () => world.getPlayers().find(p => p.name === requester.name),
      () => soundReply(player, config.Teleported_Message, "mob.endermen.portal"))
  }
})
