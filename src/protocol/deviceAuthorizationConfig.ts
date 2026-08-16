import * as v from "valibot"

export const deviceAuthorizationConfigSchema = v.object({
  authorizationDetails: v.optional(v.pipe(v.string(), v.minLength(1))),
  clientAuthentication: v.picklist(["none", "client_secret_basic", "client_secret_post"]),
  clientId: v.pipe(v.string(), v.minLength(1)),
  clientSecret: v.optional(v.pipe(v.string(), v.minLength(1))),
  deviceAuthorizationEndpoint: v.pipe(v.string(), v.minLength(1), v.url()),
  issuer: v.optional(v.pipe(v.string(), v.minLength(1), v.url())),
  parameters: v.record(v.string(), v.string()),
  resource: v.array(v.pipe(v.string(), v.minLength(1))),
  scope: v.optional(v.pipe(v.string(), v.minLength(1))),
})

export type DeviceAuthorizationConfig = v.InferOutput<typeof deviceAuthorizationConfigSchema>
