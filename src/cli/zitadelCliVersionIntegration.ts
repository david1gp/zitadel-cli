import type { ApplicationFlagFunction, CommandContext, StricliIntegration } from "@stricli/core"
import { PACKAGE_VERSION } from "../packageVersion.js"
import { zitadelCliVersionMetadataRender } from "./zitadelCliVersionMetadataRender.js"

const zitadelCliVersionFlagRun: ApplicationFlagFunction<CommandContext> = function (_application, { result }) {
  const verbose = result.unprocessedInputs.includes("--verbose") || result.unprocessedInputs.includes("-v")
  this.process.stdout.write(`${verbose ? zitadelCliVersionMetadataRender() : PACKAGE_VERSION}\n`)
}

export const zitadelCliVersionIntegration: StricliIntegration<CommandContext> = {
  flag: {
    aliases: ["v"],
    brief: "Print version information and exit",
    defaultForRouteMap: false,
    global: false,
    run: zitadelCliVersionFlagRun,
  },
}
