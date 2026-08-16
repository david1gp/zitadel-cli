#!/usr/bin/env bun
import { run } from "@stricli/core"
import { zitadelCliApplication } from "./cli/zitadelCliApplication.js"

await run(zitadelCliApplication, process.argv.slice(2), { process })
