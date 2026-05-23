import { world, system } from "@minecraft/server"
import { registerCommand } from "../CommandRegistry.js"
import { config } from "../../config.js"
import { soundReply } from "../../utilities/SoundReply.js"

const commandInformation = { name: "feed", description: "Восстановить голод", usage: [{ name: "player", type: "String", optional: true }] }

registerCommand(commandInformation, (origin, targetName) => {
  const player = origin.sourceEntity
  if (!player) return
  if (!player.hasTag(config.tags.feed) && !player.hasTag(config.admin_tag)) return soundReply(player, config.No_Permission, "note.bassattack")
  if (targetName && !player.hasTag(config.admin_tag)) return soundReply(player, config.No_Permission, "note.bassattack")
  const target = targetName ? world.getPlayers().find(p => p.name === targetName) : player
  if (!target) return soundReply(player, config.Player_Is_Null, "note.bassattack")
  system.run(() => {
    try {
      target.addEffect("saturation", 1, { amplifier: 255, showParticles: false })
      target.hunger = 20
      target.saturation = 20
    } catch {}
    soundReply(player, config.Feed_Message, "note.pling")
  })
})
