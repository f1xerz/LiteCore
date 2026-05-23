import { world, system } from "@minecraft/server"
import { registerCommand } from "../CommandRegistry.js"
import { config } from "../../config.js"
import * as db from "../../utilities/DatabaseHandler.js"
import { soundReply } from "../../utilities/SoundReply.js"
import { checkCooldown, teleportWithDelay } from "../../utilities/CoreUtils.js"

const commandInformation = { name: "tpa", description: "Запрос телепортации к игроку", usage: [{ name: "player", type: "String", optional: false }] }

registerCommand(commandInformation, (origin, target) => {
  const player = origin.sourceEntity
  if (!player) return
  if (checkCooldown(player)) return
  const targetPlayer = world.getPlayers().find(p => p.name === target)
  if (!targetPlayer) return soundReply(player, config.Player_Is_Null, "note.bassattack")
  if (player.name === targetPlayer.name) return soundReply(player, config.Tpa_Is_Player, "note.bassattack")
  const toggle = db.fetch("litecore:toggle", true)
  if (toggle.some(d => d.name === targetPlayer.name)) return soundReply(player, config.TpaToggled_Player_Message, "note.bassattack")
  const ignore = db.fetch("litecore:ignore", true)
  if (ignore.some(d => d.blocker === targetPlayer.name && d.blockedUser === player.name)) return soundReply(player, config.Player_Has_Ignored_You, "note.bassattack")
  let requests = db.fetch("litecore:requests", true)
  if (requests.some(d => d.requester === player.name && d.type === "tpa")) return soundReply(player, config.Already_A_TP_Request, "note.bassattack")

  if (targetPlayer.hasTag("litecore:auto")) {
    soundReply(player, config.Sending_Teleport_Request.replace("%player%", targetPlayer.name), "note.pling")
    teleportWithDelay(player, () => world.getPlayers().find(p => p.name === targetPlayer.name),
      () => soundReply(player, config.Teleported_Message, "mob.endermen.portal"))
    return
  }

  requests.push({ requester: player.name, receiver: targetPlayer.name, type: "tpa" })
  db.store("litecore:requests", requests)
  system.run(() => {
    targetPlayer.sendMessage(`${config.prefix} ${config.Sent_Request_On_You.replace("%player%", player.name)}`)
    targetPlayer.playSound("note.banjo")
    player.sendMessage(`${config.prefix} ${config.Sending_Teleport_Request.replace("%player%", targetPlayer.name)}`)
  })
  system.runTimeout(() => {
    let r = db.fetch("litecore:requests", true)
    if (!r.find(d => d.requester === player.name && d.receiver === targetPlayer.name)) return
    db.store("litecore:requests", r.filter(d => !(d.requester === player.name && d.receiver === targetPlayer.name)))
    soundReply(player, config.Timed_Out_Message, "note.bassattack")
  }, config.keep_alive * 20)
})
