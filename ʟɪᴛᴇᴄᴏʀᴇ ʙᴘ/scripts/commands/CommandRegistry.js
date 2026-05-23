import { system } from "@minecraft/server"
import { config } from "../config.js"

let commands = []

export function registerCommand(comInfo, callback) {
  let optionalParameters = [], mandatoryParameters = []
  ;(comInfo?.usage || []).forEach(p => {
    p.optional
      ? optionalParameters.push({ name: p.name, type: p.type })
      : mandatoryParameters.push({ name: p.name, type: p.type })
  })
  ;(comInfo?.aliases || []).forEach(alias => {
    commands.push({ commandInformation: { name: `${config.commands.namespace}:${alias}`, description: comInfo?.description, permissionLevel: comInfo?.permissionLevel || 0, cheatsRequired: false, optionalParameters, mandatoryParameters }, callback })
  })
  commands.push({ commandInformation: { name: `${config.commands.namespace}:${comInfo?.name}`, description: comInfo?.description, permissionLevel: comInfo?.permissionLevel || 0, cheatsRequired: false, optionalParameters, mandatoryParameters }, callback })
}

system.beforeEvents.startup.subscribe((init) => {
  for (const command of commands) {
    init.customCommandRegistry.registerCommand(command.commandInformation, command.callback)
  }
})
