# `ApplicationService.ReactivateApplication`

This slice exposes the stable v2 `ApplicationService.ReactivateApplication` operation through the typed library and `zitadel-cli applications reactivate`.

Official reference: <https://zitadel.com/docs/reference/api/application/zitadel.application.v2.ApplicationService.ReactivateApplication>

## Request discovery

The request is the generated `ReactivateApplicationRequest` protobuf shape. It requires both the application ID and the project ID:

```sh
zitadel-cli applications reactivate \
  --request-json '{"applicationId":"application-1","projectId":"project-1"}'
```

Use `--request-file path/to/request.json` for a checked-in request. The flags `--base-url`, `--token`, and `--env-file` override the corresponding `ZITADEL_BASE_URL` and `ZITADEL_TOKEN` values with precedence: flags, process environment, then the explicitly selected `.env` file. Output defaults to JSON; use `--output yaml` for YAML.
