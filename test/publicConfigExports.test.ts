import { describe, expect, test } from "bun:test"
import type { PromiseResult } from "@adaptive-ds/result"
import {
  type CentralConfig,
  type CentralConfigReadOptions,
  type CredentialsConfig,
  type CredentialsConfigReadOptions,
  centralConfigRead,
  credentialsConfigRead,
  type ProfileConfig,
  type ProfileConfigReadOptions,
  type ProjectConfig,
  type ProjectConfigReadOptions,
  profileConfigRead,
  projectConfigRead,
  type TestUserIdResolveOptions,
  testUserIdResolve,
  type ZitadelConfig,
  type ZitadelConfigCreateOptions,
  type ZitadelConfigResolution,
  type ZitadelConfigResolveOptions,
  zitadelConfigCreate,
  zitadelConfigResolve,
} from "@adaptive-ds/zitadel-cli"
import {
  centralConfigRead as configCentralConfigRead,
  credentialsConfigRead as configCredentialsConfigRead,
  profileConfigRead as configProfileConfigRead,
  projectConfigRead as configProjectConfigRead,
  testUserIdResolve as configTestUserIdResolve,
  zitadelConfigResolve as configZitadelConfigResolve,
} from "@adaptive-ds/zitadel-cli/config"

type Assert<T extends true> = T
type IsExact<Actual, Expected> = [Actual] extends [Expected] ? ([Expected] extends [Actual] ? true : false) : false

type CentralReadReturn = Assert<IsExact<ReturnType<typeof centralConfigRead>, PromiseResult<CentralConfig | undefined>>>
type ConfigCentralReadReturn = Assert<
  IsExact<ReturnType<typeof configCentralConfigRead>, PromiseResult<CentralConfig | undefined>>
>
type CredentialsReadReturn = Assert<IsExact<ReturnType<typeof credentialsConfigRead>, PromiseResult<CredentialsConfig>>>
type ConfigCredentialsReadReturn = Assert<
  IsExact<ReturnType<typeof configCredentialsConfigRead>, PromiseResult<CredentialsConfig>>
>
type ProfileReadReturn = Assert<IsExact<ReturnType<typeof profileConfigRead>, PromiseResult<ProfileConfig>>>
type ConfigProfileReadReturn = Assert<IsExact<ReturnType<typeof configProfileConfigRead>, PromiseResult<ProfileConfig>>>
type ProjectReadReturn = Assert<IsExact<ReturnType<typeof projectConfigRead>, PromiseResult<ProjectConfig>>>
type ConfigProjectReadReturn = Assert<IsExact<ReturnType<typeof configProjectConfigRead>, PromiseResult<ProjectConfig>>>
type TestUserIdReturn = Assert<IsExact<ReturnType<typeof testUserIdResolve>, PromiseResult<string>>>
type ConfigTestUserIdReturn = Assert<IsExact<ReturnType<typeof configTestUserIdResolve>, PromiseResult<string>>>
type ResolutionReturn = Assert<IsExact<ReturnType<typeof zitadelConfigResolve>, PromiseResult<ZitadelConfigResolution>>>
type ConfigResolutionReturn = Assert<
  IsExact<ReturnType<typeof configZitadelConfigResolve>, PromiseResult<ZitadelConfigResolution>>
>
type CreateReturn = Assert<IsExact<ReturnType<typeof zitadelConfigCreate>, PromiseResult<ZitadelConfig>>>

const centralOptions: CentralConfigReadOptions = {}
const resolveOptions: ZitadelConfigResolveOptions = { profile: "alpha", project: "application" }
const credentialsOptions: CredentialsConfigReadOptions = { profile: "alpha" }
const profileOptions: ProfileConfigReadOptions = { profile: "alpha" }
const projectOptions: ProjectConfigReadOptions = { project: "application" }
const testUserOptions: TestUserIdResolveOptions = { profile: "alpha", user: "admin" }
const createOptions: ZitadelConfigCreateOptions = { baseUrl: "https://example.test", token: "token" }

void centralOptions
void resolveOptions
void credentialsOptions
void profileOptions
void projectOptions
void testUserOptions
void createOptions
void (undefined as unknown as CentralReadReturn)
void (undefined as unknown as ConfigCentralReadReturn)
void (undefined as unknown as CredentialsReadReturn)
void (undefined as unknown as ConfigCredentialsReadReturn)
void (undefined as unknown as ProfileReadReturn)
void (undefined as unknown as ConfigProfileReadReturn)
void (undefined as unknown as ProjectReadReturn)
void (undefined as unknown as ConfigProjectReadReturn)
void (undefined as unknown as TestUserIdReturn)
void (undefined as unknown as ConfigTestUserIdReturn)
void (undefined as unknown as ResolutionReturn)
void (undefined as unknown as ConfigResolutionReturn)
void (undefined as unknown as CreateReturn)

describe("public configuration exports", () => {
  test("exports loaders from the root and config package entry points", () => {
    expect(centralConfigRead).toBeFunction()
    expect(credentialsConfigRead).toBeFunction()
    expect(profileConfigRead).toBeFunction()
    expect(projectConfigRead).toBeFunction()
    expect(testUserIdResolve).toBeFunction()
    expect(zitadelConfigResolve).toBeFunction()
    expect(configCentralConfigRead).toBeFunction()
    expect(configCredentialsConfigRead).toBeFunction()
    expect(configProfileConfigRead).toBeFunction()
    expect(configProjectConfigRead).toBeFunction()
    expect(configTestUserIdResolve).toBeFunction()
    expect(configZitadelConfigResolve).toBeFunction()
  })
})
