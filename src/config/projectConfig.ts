import * as v from "valibot"

export const projectConfigSchema = v.object({
  profile: v.pipe(v.string(), v.minLength(1)),
  projectId: v.pipe(v.string(), v.minLength(1)),
})

export type ProjectConfig = v.InferOutput<typeof projectConfigSchema>
