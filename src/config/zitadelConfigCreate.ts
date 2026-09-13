import * as v from "valibot"
import { createResult, createResultError, type PromiseResult } from "#result"
import { type ZitadelConfig, zitadelConfigSchema } from "./zitadelConfig.js"
import { type ZitadelConfigResolveOptions, zitadelConfigResolve } from "./zitadelConfigResolve.js"

export type ZitadelConfigCreateOptions = ZitadelConfigResolveOptions

export async function zitadelConfigCreate(options: ZitadelConfigCreateOptions = {}): PromiseResult<ZitadelConfig> {
  const op = "zitadelConfigCreate"
  const resolution = await zitadelConfigResolve(options)
  if (!resolution.success) {
    return createResultError(op, resolution.errorMessage)
  }

  const parsed = v.safeParse(zitadelConfigSchema, resolution.data)
  if (!parsed.success) {
    return createResultError(op, v.summarize(parsed.issues))
  }

  const config: ZitadelConfig = {
    ...parsed.output,
    baseUrl: parsed.output.baseUrl.replace(/\/+$/, "") || parsed.output.baseUrl,
  }
  return createResult(config)
}
