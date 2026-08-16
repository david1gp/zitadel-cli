# `ProjectService.ActivateProject`

This slice exposes the stable v2 `ProjectService.ActivateProject` operation through the typed library and `zitadel-cli projects activate` command.

Official reference: <https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.ActivateProject>

## Request discovery

The request is the generated `ActivateProjectRequest` protobuf shape; no CLI field schema is duplicated. Discover its current fields from the generated descriptor/types, then pass protobuf JSON directly:

```sh
zitadel-cli projects activate \
  --request-json '{"projectId":"project-id"}'
```

Use `--request-file path/to/request.json` for a checked-in request. The flags `--base-url`, `--token`, and `--env-file` override the corresponding `ZITADEL_BASE_URL` and `ZITADEL_TOKEN` values with precedence: flags, process environment, then the explicitly selected `.env` file. Output defaults to JSON; use `--output yaml` for YAML.
