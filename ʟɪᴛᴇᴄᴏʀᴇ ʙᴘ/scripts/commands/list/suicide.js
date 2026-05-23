import { system } from "@minecraft/server"
import { registerCommand } from "../CommandRegistry.js"
import { config } from "../../config.js"
import { soundReply } from "../../utilities/SoundReply.js"

const commandInformation = { name: "suicide", description: "Суицид", usage: [] }

registerCommand(commandInformation, (origin) => {
  const player = origin.sourceEntity
  if (!player) return
  if (!player.hasTag(config.tags.suicide) && !player.hasTag(config.admin_tag)) return soundReply(player, config.No_Permission, "note.bassattack")
  system.run(() => {
    player.sendMessage(`${config.prefix} ${config.Suicide_Message}`)
    const health = player.getComponent("minecraft:health")
    if (health) health.setCurrentValue(0)
  })
})
