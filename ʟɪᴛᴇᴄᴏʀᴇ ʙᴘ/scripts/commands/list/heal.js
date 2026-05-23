import { world, system } from "@minecraft/server"
import { registerCommand } from "../CommandRegistry.js"
import { config } from "../../config.js"
import { soundReply } from "../../utilities/SoundReply.js"

const commandInformation = { name: "heal", description: "Восстановить здоровье", usage: [{ name: "player", type: "String", optional: true }] }

registerCommand(commandInformation, (origin, targetName) => {
  const player = origin.sourceEntity
  if (!player) return
  if (!player.hasTag(config.tags.heal) && !player.hasTag(config.admin_tag)) return soundReply(player, config.No_Permission, "note.bassattack")
  if (targetName && !player.hasTag(config.admin_tag)) return soundReply(player, config.No_Permission, "note.bassattack")
  const target = targetName ? world.getPlayers().find(p => p.name === targetName) : player
  if (!target) return soundReply(player, config.Player_Is_Null, "note.bassattack")
  system.run(() => {
    const health = target.getComponent("minecraft:health")
    if (health) health.resetToMaxValue()
    soundReply(player, config.Heal_Message, "note.pling")
  })
})
