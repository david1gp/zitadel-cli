import { UserService as GeneratedUserService } from "../generated/zitadel/user/v2/user_service_pb.js"

const deprecatedUserMethodNames = new Set([
  "addHumanUser",
  "passwordReset",
  "removePhone",
  "resendInviteCode",
  "setEmail",
  "setPhone",
  "updateHumanUser",
])

const supportedUserMethods = GeneratedUserService.methods.filter(
  ({ deprecated, localName }) => !deprecated && !deprecatedUserMethodNames.has(localName),
)

export const UserService = {
  ...GeneratedUserService,
  methods: supportedUserMethods,
} as const
