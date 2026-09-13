import * as v from "valibot"

export const testUserSchema = v.object({
  password: v.pipe(v.string(), v.minLength(1)),
  userId: v.pipe(v.string(), v.minLength(1)),
  username: v.pipe(v.string(), v.minLength(1)),
})

export type TestUser = v.InferOutput<typeof testUserSchema>
