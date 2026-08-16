# `ApplicationService.DeleteApplicationKey`

This slice exposes the stable v2 `ApplicationService.DeleteApplicationKey` operation through the typed library and its CLI command.

Official reference: <https://zitadel.com/docs/reference/api/application/zitadel.application.v2.ApplicationService.DeleteApplicationKey>

## Request discovery

The request is the generated `DeleteApplicationKeyRequest` protobuf shape. Pass the application key, application, and project IDs as protobuf JSON:

```sh
zitadel-cli applications delete-application-key \
  --request-json '{"keyId":"key-1","applicationId":"application-1","projectId":"project-1"}'
```

Use `--request-file path/to/request.json` for a checked-in request. The flags `--base-url`, `--token`, and `--env-file` override the corresponding `ZITADEL_BASE_URL` and `ZITADEL_TOKEN` values with precedence: flags, process environment, then the explicitly selected `.env` file. Output defaults to JSON; use `--output yaml` for YAML.
