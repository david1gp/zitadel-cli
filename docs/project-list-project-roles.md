# `ProjectService.ListProjectRoles`

This slice exposes the stable v2 `ProjectService.ListProjectRoles` operation through the typed library and the endpoint command definition.

Official reference: <https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.ListProjectRoles>

## Request discovery

The request is the generated `ListProjectRolesRequest` protobuf shape; no CLI field schema is duplicated. Discover its current fields from the generated descriptor/types, then pass protobuf JSON directly:

```sh
zitadel-cli projects roles list \
  --request-json '{"projectId":"project-1","pagination":{"limit":25},"sortingColumn":"PROJECT_ROLE_FIELD_NAME_KEY"}'
```

Use `--request-file path/to/request.json` for a checked-in request. The flags `--base-url`, `--token`, and `--env-file` override the corresponding `ZITADEL_BASE_URL` and `ZITADEL_TOKEN` values with precedence: flags, process environment, then the explicitly selected `.env` file. Output defaults to JSON; use `--output yaml` for YAML.
