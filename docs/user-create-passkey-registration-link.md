# `UserService.CreatePasskeyRegistrationLink`

This slice exposes the stable v2 `UserService.CreatePasskeyRegistrationLink` operation through the typed library and `zitadel-cli users create-passkey-registration-link` command.

Official reference: <https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.CreatePasskeyRegistrationLink>

## Request discovery

The request is the generated `CreatePasskeyRegistrationLinkRequest` protobuf shape; no CLI field schema is duplicated. Discover its current fields from the generated descriptor/types, then pass protobuf JSON directly:

```sh
zitadel-cli users create-passkey-registration-link \
  --request-json '{"userId":"user-id","returnCode":{}}'
```

Use `sendLink` instead to send an email with an optional custom URL template:

```sh
zitadel-cli users create-passkey-registration-link \
  --request-json '{"userId":"user-id","sendLink":{"urlTemplate":"https://example.com/passkey?userID={{.UserID}}&orgID={{.OrgID}}&codeID={{.CodeID}}&code={{.Code}}"}}'
```

Use `--request-file path/to/request.json` for a checked-in request. The flags `--base-url`, `--token`, and `--env-file` override the corresponding `ZITADEL_BASE_URL` and `ZITADEL_TOKEN` values with precedence: flags, process environment, then the explicitly selected `.env` file. Output defaults to JSON; use `--output yaml` for YAML.
