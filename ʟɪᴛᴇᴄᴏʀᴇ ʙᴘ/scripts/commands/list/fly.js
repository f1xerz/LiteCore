import { world, system } from "@minecraft/server"
import { registerCommand } from "../CommandRegistry.js"
import { config } from "../../config.js"
import { soundReply } from "../../utilities/SoundReply.js"

const commandInformation = { name: "fly", description: "Режим полёта", usage: [{ name: "state", type: "String", optional: true }, { name: "player", type: "String", optional: true }] }

registerCommand(commandInformation, (origin, state, targetName) => {
  const player = origin.sourceEntity
  if (!player) return
  if (!player.hasTag(config.tags.fly) && !player.hasTag(config.admin_tag)) return soundReply(player, config.No_Permission, "note.bassattack")
  if (targetName && !player.hasTag(config.admin_tag)) return soundReply(player, config.No_Permission, "note.bassattack")
  const target = targetName ? world.getPlayers().find(p => p.name === targetName) : player
  if (!target) return soundReply(player, config.Player_Is_Null, "note.bassattack")
  system.run(() => {
    const ab = target.getComponent("minecraft:movement.flying")
    let enable = state ? state.toLowerCase() === "on" : !target.isFlying
    target.onScreenDisplay.setActionBar("")
    target.runCommand(`ability @s mayfly ${enable}`)
    if (!enable) target.runCommand("ability @s flying false")
    soundReply(player, enable ? config.Fly_On : config.Fly_Off, "note.pling")
  })
})
