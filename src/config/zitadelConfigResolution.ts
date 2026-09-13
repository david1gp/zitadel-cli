import * as v from "valibot"

const optionalIdentifier = v.optional(v.pipe(v.string(), v.minLength(1)))

export const zitadelConfigResolutionSchema = v.object({
  baseUrl: v.optional(v.pipe(v.string(), v.minLength(1), v.url())),
  organizationId: optionalIdentifier,
  profile: optionalIdentifier,
  project: optionalIdentifier,
  projectId: optionalIdentifier,
  token: optionalIdentifier,
})

export type ZitadelConfigResolution = v.InferOutput<typeof zitadelConfigResolutionSchema>
