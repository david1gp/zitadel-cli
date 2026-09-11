import type { ApplicationContext, Command } from "@stricli/core"
import { buildCommand } from "@stricli/core"
import { PACKAGE_VERSION } from "../packageVersion.js"
import { zitadelCliVersionMetadataRender } from "./zitadelCliVersionMetadataRender.js"

type ZitadelCliVersionCommandFlags = {
  readonly verbose?: boolean
}

export const zitadelCliVersionCommand: Command<ApplicationContext> = buildCommand<
  ZitadelCliVersionCommandFlags,
  [],
  ApplicationContext
>({
  func: function (flags) {
    this.process.stdout.write(`${flags.verbose === true ? zitadelCliVersionMetadataRender() : PACKAGE_VERSION}\n`)
  },
  parameters: {
    flags: {
      verbose: {
        brief: "Print package and environment metadata",
        kind: "boolean",
        optional: true,
      },
    },
    aliases: { v: "verbose" },
  },
  docs: {
    brief: "Print version information",
  },
})
