# `ApplicationService.DeactivateApplication`

This slice exposes the stable v2 `ApplicationService.DeactivateApplication` operation through the typed library and `zitadel-cli applications deactivate` command.

Official reference: <https://zitadel.com/docs/reference/api/application/zitadel.application.v2.ApplicationService.DeactivateApplication>

## Request discovery

The request is the generated `DeactivateApplicationRequest` protobuf shape; no CLI field schema is duplicated. Discover its current fields from the generated descriptor/types, then pass protobuf JSON directly:

```sh
zitadel-cli applications deactivate \
  --request-json '{"applicationId":"application-id","projectId":"project-id"}'
```

Use `--request-file path/to/request.json` for a checked-in request. The flags `--base-url`, `--token`, and `--env-file` override the corresponding `ZITADEL_BASE_URL` and `ZITADEL_TOKEN` values with precedence: flags, process environment, then the explicitly selected `.env` file. Output defaults to JSON; use `--output yaml` for YAML.
