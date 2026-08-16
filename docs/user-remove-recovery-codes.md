# `UserService.RemoveRecoveryCodes`

This slice exposes the stable v2 `UserService.RemoveRecoveryCodes` operation through the typed library and `zitadel-cli users remove-recovery-codes` command.

Official reference: <https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.RemoveRecoveryCodes>

## Request discovery

The request is the generated `RemoveRecoveryCodesRequest` protobuf shape. Pass its `userId` field as protobuf JSON; the operation removes all recovery codes and disables the recovery-code second factor:

```sh
zitadel-cli users remove-recovery-codes \
  --request-json '{"userId":"user-id"}'
```

Use `--request-file path/to/request.json` for a checked-in request. The flags `--base-url`, `--token`, and `--env-file` override the corresponding `ZITADEL_BASE_URL` and `ZITADEL_TOKEN` values with precedence: flags, process environment, then the explicitly selected `.env` file. Output defaults to JSON; use `--output yaml` for YAML.
