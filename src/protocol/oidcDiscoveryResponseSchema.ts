import * as v from "valibot"

const oidcDiscoveryEndpointSchema = v.pipe(v.string(), v.minLength(1), v.url())
const oidcDiscoveryStringArraySchema = v.pipe(v.array(v.string()), v.minLength(1))

export const oidcDiscoveryResponseSchema = v.looseObject({
  authorization_endpoint: oidcDiscoveryEndpointSchema,
  id_token_signing_alg_values_supported: oidcDiscoveryStringArraySchema,
  issuer: oidcDiscoveryEndpointSchema,
  jwks_uri: oidcDiscoveryEndpointSchema,
  response_types_supported: oidcDiscoveryStringArraySchema,
  subject_types_supported: oidcDiscoveryStringArraySchema,
  acr_values_supported: v.optional(v.array(v.string())),
  claims_locales_supported: v.optional(v.array(v.string())),
  claims_parameter_supported: v.optional(v.boolean()),
  claims_supported: v.optional(v.array(v.string())),
  code_challenge_methods_supported: v.optional(v.array(v.string())),
  display_values_supported: v.optional(v.array(v.string())),
  grant_types_supported: v.optional(v.array(v.string())),
  id_token_encryption_alg_values_supported: v.optional(v.array(v.string())),
  id_token_encryption_enc_values_supported: v.optional(v.array(v.string())),
  introspection_endpoint: v.optional(oidcDiscoveryEndpointSchema),
  introspection_endpoint_auth_methods_supported: v.optional(v.array(v.string())),
  op_policy_uri: v.optional(oidcDiscoveryEndpointSchema),
  op_tos_uri: v.optional(oidcDiscoveryEndpointSchema),
  registration_endpoint: v.optional(oidcDiscoveryEndpointSchema),
  request_object_encryption_alg_values_supported: v.optional(v.array(v.string())),
  request_object_encryption_enc_values_supported: v.optional(v.array(v.string())),
  request_object_signing_alg_values_supported: v.optional(v.array(v.string())),
  request_parameter_supported: v.optional(v.boolean()),
  request_uri_parameter_supported: v.optional(v.boolean()),
  response_modes_supported: v.optional(v.array(v.string())),
  revocation_endpoint: v.optional(oidcDiscoveryEndpointSchema),
  revocation_endpoint_auth_methods_supported: v.optional(v.array(v.string())),
  scopes_supported: v.optional(v.array(v.string())),
  service_documentation: v.optional(oidcDiscoveryEndpointSchema),
  token_endpoint: v.optional(oidcDiscoveryEndpointSchema),
  token_endpoint_auth_methods_supported: v.optional(v.array(v.string())),
  token_endpoint_auth_signing_alg_values_supported: v.optional(v.array(v.string())),
  ui_locales_supported: v.optional(v.array(v.string())),
  userinfo_endpoint: v.optional(oidcDiscoveryEndpointSchema),
  userinfo_encryption_alg_values_supported: v.optional(v.array(v.string())),
  userinfo_encryption_enc_values_supported: v.optional(v.array(v.string())),
  userinfo_signing_alg_values_supported: v.optional(v.array(v.string())),
})

export type OidcDiscoveryResponse = v.InferOutput<typeof oidcDiscoveryResponseSchema>
