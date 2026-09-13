import { createResult, createResultError, type PromiseResult } from "#result"
import { credentialsConfigRead, type CredentialsConfigReadOptions } from "./credentialsConfigRead.js"

export type TestUserIdResolveOptions = CredentialsConfigReadOptions & {
  readonly user: string
}

export async function testUserIdResolve(options: TestUserIdResolveOptions): PromiseResult<string> {
  const credentialsResult = await credentialsConfigRead(options)
  if (!credentialsResult.success) return credentialsResult

  const testUser = credentialsResult.data.testUsers[options.user]
  if (testUser === undefined) {
    return createResultError(
      "testUserIdResolve",
      `The test user "${options.user}" was not found in the selected credentials`,
    )
  }
  return createResult(testUser.userId)
}
