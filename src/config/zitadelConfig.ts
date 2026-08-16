import * as v from "valibot"

export const zitadelConfigSchema = v.object({
  baseUrl: v.pipe(v.string(), v.minLength(1), v.url()),
  token: v.pipe(v.string(), v.minLength(1)),
})

export type ZitadelConfig = v.InferOutput<typeof zitadelConfigSchema>
