# `ProjectService.UpdateProjectGrant`

This slice exposes the stable v2 `ProjectService.UpdateProjectGrant` operation through the typed library and CLI command definition.

Official reference: <https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.UpdateProjectGrant>

## Request discovery

The request is the generated `UpdateProjectGrantRequest` protobuf shape; no CLI field schema is duplicated. Discover its current fields from the generated descriptor/types, then pass protobuf JSON directly:

```sh
zitadel-cli projects update-project-grant \
  --request-json '{"projectId":"project-1","grantedOrganizationId":"organization-1","roleKeys":["project.read"]}'
```

`roleKeys` replaces the complete set of roles on the project grant. Use `--request-file path/to/request.json` for a checked-in request. The flags `--base-url`, `--token`, and `--env-file` override the corresponding `ZITADEL_BASE_URL` and `ZITADEL_TOKEN` values with precedence: flags, process environment, then the explicitly selected `.env` file. Output defaults to JSON; use `--output yaml` for YAML.
