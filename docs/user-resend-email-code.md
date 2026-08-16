# `UserService.ResendEmailCode`

This slice exposes the stable v2 `UserService.ResendEmailCode` operation through the typed library and CLI endpoint command.

Official reference: <https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.ResendEmailCode>

## Request discovery

The request is the generated `ResendEmailCodeRequest` protobuf shape; no CLI field schema is duplicated. Discover its current fields from the generated descriptor/types, then pass protobuf JSON directly:

```sh
zitadel-cli users resend-email-code \
  --request-json '{"userId":"user-id","sendCode":{}}'
```

Omit `sendCode` and `returnCode` to send the email with ZITADEL's default URL. Use `{"returnCode":{}}` to return the verification code in the response instead of sending it by email.

Use `--request-file path/to/request.json` for a checked-in request. The flags `--base-url`, `--token`, and `--env-file` override the corresponding `ZITADEL_BASE_URL` and `ZITADEL_TOKEN` values with precedence: flags, process environment, then the explicitly selected `.env` file. Output defaults to JSON; use `--output yaml` for YAML.
