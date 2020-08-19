// LICENSE: CC0-1.0

import { deepStrictEqual, ok, throws, fail } from "assert"
import {
  DefineTestCaseFn,
  TestApi,
  TestAssertApi,
  TestCaseDefiner,
  TestGroup,
  GroupedTestApi,
  TestGroupMap,
} from "test-api-ts"

declare const before: any
declare const after: any
declare const beforeEach: any
declare const afterEach: any
declare const describe: any
declare const it: any

const pass = (message?: string | Error) =>
  ok(true, message)

const assertionApi: TestAssertApi = {
  pass,
  fail,
  equals: deepStrictEqual,
  throws,
}

const doTest: DefineTestCaseFn = (title, bodyFn) =>
  it(title, () => bodyFn(assertionApi))

const doTestOnly: DefineTestCaseFn = (title, bodyFn) =>
  it.only(title, () => bodyFn(assertionApi))

const doTestSkip: DefineTestCaseFn = (title, bodyFn) =>
  it.skip(title, () => bodyFn(assertionApi))

const createDefiner = (): TestCaseDefiner => {
  const definer = doTest as TestCaseDefiner
  definer.only = doTestOnly
  definer.skip = doTestSkip
  return definer
}

const doSuite = (title: string, bodyFn: TestGroup, api: GroupedTestApi): void =>
  describe(title, () => bodyFn(api))

const doRunSuiteMap = (suites: TestGroupMap, api: TestApi) => {
  for (const key in suites) {
    if (suites.hasOwnProperty(key)) {
      if (suites[key] instanceof Function) {
        api.group(key, suites[key])
      } else {
        // This happens when ill-typed test code is emitted and executed.
        api.test.skip(key, () => pass())
      }
    }
  }
}

export const createMochaTestApi = (): TestApi => {
  const it: GroupedTestApi = {
    before,
    after,
    beforeEach,
    afterEach,
    test: createDefiner(),
    group: (title, bodyFn) =>
      doSuite(title, bodyFn, it),
    runSuiteMap: suites =>
      doRunSuiteMap(suites, it),
  }
  return it
}
