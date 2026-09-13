import * as v from "valibot"

export const profileConfigSchema = v.object({
  baseUrl: v.pipe(v.string(), v.minLength(1), v.url()),
  organizationId: v.pipe(v.string(), v.minLength(1)),
})

export type ProfileConfig = v.InferOutput<typeof profileConfigSchema>
