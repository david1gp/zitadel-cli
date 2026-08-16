# `ApplicationService.GetApplicationKey`

This slice exposes the stable v2 `ApplicationService.GetApplicationKey` operation through the typed library and CLI endpoint command.

Official reference: <https://zitadel.com/docs/reference/api/application/zitadel.application.v2.ApplicationService.GetApplicationKey>

## Request discovery

The request is the generated `GetApplicationKeyRequest` protobuf shape; no CLI field schema is duplicated. Discover its current fields from the generated descriptor/types, then pass protobuf JSON directly:

```sh
zitadel-cli applications get-application-key \
  --request-json '{"keyId":"key-id"}'
```

Use `--request-file path/to/request.json` for a checked-in request. The flags `--base-url`, `--token`, and `--env-file` override the corresponding `ZITADEL_BASE_URL` and `ZITADEL_TOKEN` values with precedence: flags, process environment, then the explicitly selected `.env` file. Output defaults to JSON; use `--output yaml` for YAML.
