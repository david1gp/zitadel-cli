# ZITADEL CLI

## Goal

Create `@adaptive-ds/zitadel-cli` as a publishable TypeScript library and `zitadel-cli` executable for ZITADEL's stable, non-deprecated APIs, protocol authentication, and two isolated legacy v1 IDP operations.

## Decisions

- Follow the `waha-client` Bun, TypeScript, Stricli, Valibot, and `@adaptive-ds/result` setup and repository conventions.
- Pin generated protobuf/Connect contracts to released ZITADEL `v4.17.1`; expose stable v2 Project, Application, User, Internal Permission, Organization, and Action services.
- Keep `AdminService.ListIDPs` and `AdminService.AddGoogleProvider` in `legacy_v1`; exclude beta, alpha, other v1, and deprecated methods from the supported registry.
- Share generated schemas, descriptors, configuration, transport, invocation, discovery, docs links, and output serialization between the library and CLI.
- Make the full supported surface discoverable through typed exports plus CLI list/describe/call commands; accept protobuf JSON requests rather than duplicating every message field as a flag.
- Load credentials from process environment and optional `.env` files, with explicit CLI arguments taking precedence; support JSON and YAML output.
- Target ZITADEL `v4.17.1` or newer and link every discoverable method to its official ZITADEL reference page.

## Approach

- Scaffold the package and copied/adapted project automation first.
- Add reproducible generated Connect/Protobuf contracts and a policy-filtered service catalog.
- Implement `ProjectService.ListProjects` as one complete library/configuration/transport/output/CLI/test vertical slice.
- After that slice is stable, implement each remaining endpoint in a separate fresh Luna subagent and parallelize independent endpoints in bounded batches.
- Reuse the shared Result-based configuration, transport, serialization, CLI, and documentation conventions established by the first slice.
- Document installation, environment, authentication, supported API policy, discovery workflow, CLI examples, and library examples.

## Tasks

- [x] 1. Scaffold package metadata, repository/config files, scripts, automation, and baseline source/test layout.
- [x] 2. Add pinned ZITADEL protobuf generation, generated contracts, stable service exports, legacy adapter, method filtering, and docs metadata.
- [x] 3. Complete the `ProjectService.ListProjects` vertical slice with shared configuration, transport, serialization, CLI, documentation, and tests.
- [x] 4. Implement each remaining supported stable v2 endpoint through the established library and CLI path, one endpoint per subagent.
- [x] 5. Implement OIDC discovery, device authorization, token, and userinfo, one protocol endpoint per subagent.
- [x] 6. Implement the two isolated legacy v1 endpoints, one endpoint per subagent.
- [x] 7. Complete the README/API discovery guide and run full formatting, type checking, tests, build, and CLI smoke verification.

## Paths

- `package.json`
- `.github/`
- `ops/`
- `proto/`
- `src/generated/`
- `src/v2/`
- `src/legacy_v1/`
- `src/protocol/`
- `src/cli/`
- `test/`
- `README.md`
