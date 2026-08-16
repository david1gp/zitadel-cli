# `ApplicationService.CreateApplicationKey`

This slice exposes the stable v2 `ApplicationService.CreateApplicationKey` operation through the typed library and `zitadel-cli applications create-key` command.

Official reference: <https://zitadel.com/docs/reference/api/application/zitadel.application.v2.ApplicationService.CreateApplicationKey>

The authenticated caller requires the `project.app.write` permission. Key details are returned only once and must be stored safely.

## Request discovery

The request is the generated `CreateApplicationKeyRequest` protobuf shape; no CLI field schema is duplicated. Discover its current fields from the generated descriptor/types, then pass protobuf JSON directly:

```sh
zitadel-cli applications create-key \
  --request-json '{"applicationId":"application-id","projectId":"project-id","expirationDate":"2030-01-01T00:00:00Z"}'
```

Use `--request-file path/to/request.json` for a checked-in request. The flags `--base-url`, `--token`, and `--env-file` override the corresponding `ZITADEL_BASE_URL` and `ZITADEL_TOKEN` values with precedence: flags, process environment, then the explicitly selected `.env` file. Output defaults to JSON; use `--output yaml` for YAML.
