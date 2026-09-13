import * as v from "valibot"
import { testUserSchema } from "./testUser.js"

export const credentialsConfigSchema = v.object({
  testUsers: v.record(v.string(), testUserSchema),
  token: v.pipe(v.string(), v.minLength(1)),
})

export type CredentialsConfig = v.InferOutput<typeof credentialsConfigSchema>
