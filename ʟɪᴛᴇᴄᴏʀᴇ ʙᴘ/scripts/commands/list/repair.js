import { system } from "@minecraft/server"
import { registerCommand } from "../CommandRegistry.js"
import { config } from "../../config.js"
import { soundReply } from "../../utilities/SoundReply.js"

const commandInformation = { name: "repair", description: "Отремонтировать предмет", usage: [{ name: "type", type: "String", optional: false }] }

registerCommand(commandInformation, (origin, type) => {
  const player = origin.sourceEntity
  if (!player) return
  if (!player.hasTag(config.tags.repair) && !player.hasTag(config.admin_tag)) return soundReply(player, config.No_Permission, "note.bassattack")
  system.run(() => {
    const inv = player.getComponent("minecraft:inventory").container
    if (type.toLowerCase() === "hand") {
      const item = inv.getItem(player.selectedSlotIndex)
      if (!item) return soundReply(player, config.Repair_Nothing, "note.bassattack")
      const dur = item.getComponent("minecraft:durability")
      if (!dur) return soundReply(player, config.Repair_Nothing, "note.bassattack")
      dur.damage = 0
      inv.setItem(player.selectedSlotIndex, item)
      soundReply(player, config.Repair_Hand, "note.pling")
    } else if (type.toLowerCase() === "all") {
      let repaired = false
      for (let i = 0; i < inv.size; i++) {
        const item = inv.getItem(i)
        if (!item) continue
        const dur = item.getComponent("minecraft:durability")
        if (!dur) continue
        dur.damage = 0
        inv.setItem(i, item)
        repaired = true
      }
      soundReply(player, repaired ? config.Repair_All : config.Repair_Nothing, "note.pling")
    }
  })
})
