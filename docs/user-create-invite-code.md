# `UserService.CreateInviteCode`

This slice exposes the stable v2 `UserService.CreateInviteCode` operation through the typed library and CLI command definition.

Official reference: <https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.CreateInviteCode>

## Request discovery

The request is the generated `CreateInviteCodeRequest` protobuf shape with `userId` and an optional `verification` oneof. Use `returnCode` to return the invite code, or `sendCode` to send it by email:

```sh
zitadel-cli users create-invite-code \
  --request-json '{"userId":"user-1","returnCode":{}}'
```

Use `--request-file path/to/request.json` for a checked-in request. The flags `--base-url`, `--token`, and `--env-file` override the corresponding `ZITADEL_BASE_URL` and `ZITADEL_TOKEN` values with precedence: flags, process environment, then the explicitly selected `.env` file. Output defaults to JSON; use `--output yaml` for YAML.
