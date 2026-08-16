# `ProjectService.CreateProject`

This slice exposes the stable v2 `ProjectService.CreateProject` operation through the typed library and `zitadel-cli projects create` command.

Official reference: <https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.CreateProject>

## Request discovery

The request is the generated `CreateProjectRequest` protobuf shape; no CLI field schema is duplicated. Discover its current fields from the generated descriptor/types, then pass protobuf JSON directly:

```sh
zitadel-cli projects create \
  --request-json '{"organizationId":"organization-id","name":"Example project"}'
```

Use `--request-file path/to/request.json` for a checked-in request. The flags `--base-url`, `--token`, and `--env-file` override the corresponding `ZITADEL_BASE_URL` and `ZITADEL_TOKEN` values with precedence: flags, process environment, then the explicitly selected `.env` file. Output defaults to JSON; use `--output yaml` for YAML.
