import * as v from "valibot"
import { profileConfigSchema } from "./profileConfig.js"

export const centralConfigSchema = v.object({
  defaultProfile: v.pipe(v.string(), v.minLength(1)),
  profiles: v.record(v.string(), profileConfigSchema),
})

export type CentralConfig = v.InferOutput<typeof centralConfigSchema>
