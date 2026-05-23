import { system } from "@minecraft/server"
import { registerCommand } from "../CommandRegistry.js"
import { config } from "../../config.js"
import { soundReply } from "../../utilities/SoundReply.js"

const commandInformation = { name: "tpauto", description: "Авто-принятие запросов", usage: [] }

registerCommand(commandInformation, (origin) => {
  const player = origin.sourceEntity
  if (!player) return
  const isAuto = player.hasTag("litecore:auto")
  system.run(() => isAuto ? player.removeTag("litecore:auto") : player.addTag("litecore:auto"))
  soundReply(player, isAuto ? config.Disabled_TpAuto : config.Enabled_TpAuto, "note.pling")
})
