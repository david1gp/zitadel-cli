# `UserService.VerifyInviteCode`

This slice exposes the stable v2 `UserService.VerifyInviteCode` operation through the typed library and endpoint CLI command.

Official reference: <https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.VerifyInviteCode>

## Request discovery

The request is the generated `VerifyInviteCodeRequest` protobuf shape. Pass the user ID and invite code as protobuf JSON:

```sh
zitadel-cli users verify-invite-code \
  --request-json '{"userId":"user-1","verificationCode":"invite-code"}'
```

Use `--request-file path/to/request.json` for a checked-in request. The flags `--base-url`, `--token`, and `--env-file` override the corresponding `ZITADEL_BASE_URL` and `ZITADEL_TOKEN` values with precedence: flags, process environment, then the explicitly selected `.env` file. Output defaults to JSON; use `--output yaml` for YAML.
