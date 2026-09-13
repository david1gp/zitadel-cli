# Central configuration and user access

## Goal

Configure Zitadel organizations, shared test identities, and projects once per Linux user. Let agents retrieve test credentials directly and assign, edit, or remove project-role assignments without locating credential files manually.

## Decisions

- Central root: `$XDG_CONFIG_HOME/zitadel-cli`, falling back to `~/.config/zitadel-cli`.
- `config.json` contains `defaultProfile` and `profiles`; each profile contains `baseUrl` and `organizationId`.
- `credentials/{profile}.json` contains `token` and `testUsers`, without a profile or Zitadel wrapper. Profile names represent organizations, such as `contentoren`.
- Each test-user entry contains `userId`, `username`, and `password`.
- `projects/{project-name}.json` contains flat `profile` and `projectId` fields. No project-local configuration file is required.
- Shared human test identities belong to an organization. Their application roles and assignments belong to individual projects. Test admin is not an organization administrator.
- Precedence: explicit CLI/library options, process environment, explicitly supplied existing env file, selected project configuration, central profile configuration, defaults. Preserve existing explicit library configuration behavior.
- Project selection uses `--project` / `ZITADEL_PROJECT`; profile selection uses `--profile` / `ZITADEL_PROFILE`. Explicit profile selection overrides the project's profile.
- Support explicit base URL, organization ID, project ID, and token overrides via CLI options and corresponding `ZITADEL_*` environment variables.
- Credential lookup supports `credentials get <test-user> --field username|password|userId` for raw output and `--output json` for the complete entry. Profile can be selected directly, through a project, or by default.
- Credential files are private (`0600`); credentials must not appear in ordinary diagnostic output.
- Export typed configuration and credential loading functions through the library's public entry points so consumers can use the same resolution and precedence as the CLI without reimplementation.
- Use existing Management v1 user-grant operations; the inspected upstream checkout has no stable v2 authorization service definitions. CLI routing: `users grants add|list|update|remove`.
- Assignment creation sets project role keys; editing replaces an assignment's role-key set; unassigning removes the entire user-project assignment. Removing one role uses an edit retaining the other roles.
- No automated identity creation, password reset, browser login, or application authorization enforcement is included.

## Approach

Reuse existing configuration resolution, CLI command builders, API adapters, validation, and dependencies. Separate local configuration/credential retrieval from API authentication so reading a test username does not require a provisioning token or network access. Resolve named projects and profiles centrally, then feed resolved context into applicable API operations without altering unrelated protobuf requests.

## Tasks

1. Completed: Confirm upstream stable v2 user-authorization coverage and finalize command routing against existing CLI conventions.
2. Completed: Implement and test central directory discovery, JSON schemas, profile/project selection, credential loading, and override precedence.
3. Completed: Add common CLI options and environment handling; integrate selected project context into applicable project operations.
4. Completed: Add local credential lookup commands with raw field and JSON output, including missing-profile/user/field tests.
5. Completed: Expose user project-role assignment creation, editing, listing, and removal; support shared test-user aliases as well as explicit user IDs. Add missing v1 adapters if required.
6. Completed: Document file examples, overrides, credential lookup, and assignment workflows; run focused tests and repository checks.
7. Completed: Verify and expose typed configuration and credential loaders through public library entry points, with consumer import tests and documentation.
