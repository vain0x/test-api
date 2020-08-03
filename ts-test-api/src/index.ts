// LICENSE: CC0-1.0

/**
 * Functions to assert.
 *
 * Passed to test body function.
 */
export interface TestAssertApi {
  /**
   * Called when a test case passed.
   */
  pass(message?: string | Error): void

  /**
   * Called when a test case failed.
   *
   * ```ts
   *  throw assert.fail("the reason why")
   * ```
   */
  fail(message?: string | Error): never

  // QUESTION: perhaps `<T, U extends T>(actual: T, expected: U, message?: _) => asserts actual is U`? with this, typescript compiler requires us to write explicit types...
  /**
   * Assert that two values equal.
   *
   * ```ts
   *  assert.equals(2 + 3, 5)
   * ```
   */
  equals<T>(actual: T, expected: T, message?: string | Error): void

  /**
   * Call a function to assert that it throws.
   * Returns the exception.
   *
   * ```ts
   *  assert.throws(() => {
   *    throw new Error("something wrong")
   *  })
   * ```
   */
  throws(bodyFn: () => void | Promise<void>, message?: string | Error): void
}

/**
 * Functions to listen to start/end of test cases.
 *
 * Passed to test suite definition.
 */
export interface TestHookApi {
  /**
   * Do something before the execution of the suite.
   */
  before(bodyFn: () => void): void

  /**
   * Do something after the execution of the suite.
   */
  after(bodyFn: () => void): void

  /**
   * Do something before execution of **each** test case in the suite.
   */
  beforeEach(bodyFn: () => void): void

  /**
   * Do something after execution of **each** test case in the suite.
   */
  afterEach(bodyFn: () => void): void
}

/**
 * Assert something for testing.
 */
export type TestBodyFn = (assert: TestAssertApi) => void | Promise<void>

/**
 * Define a test case.
 *
 * ```ts
 *  test("add", assert => {
 *    assert.equals(2 + 3, 5)
 *  })
 * ```
 *
 * ## Async
 *
 * ```ts
 *  const squareAsync = async (value: number): Promise<number> =>
 *    value * value
 *
 *  test("squareAsync", async assert => {
 *    const x = await squareAsync(3)
 *    assert.equals(x, 9)
 *  })
 * ```
 */
export type DefineTestCaseFn = (title: string, bodyFn: TestBodyFn) => void

/**
 * Function to define a test case with some methods.
 */
export interface TestCaseDefiner extends DefineTestCaseFn {
  /**
   * Define a test case that is exclusively executed.
   *
   * When used, other test cases not marked by `only` are skipped.
   *
   * ```ts
   *    test.only("test new features", () => {
   *      // This runs.
   *    })
   *
   *    // This is not defined by `test.only`, so skipped.
   *    test("test old features", () => {
   *      // This doesn't run.
   *    })
   * ```
   */
  only: DefineTestCaseFn

  /**
   * Define a test case that is NOT executed.
   *
   * ```ts
   *    test.skip("test a feature not implemented yet", () => {
   *      // This doesn't run.
   *    })
   * ```
   */
  skip: DefineTestCaseFn
}

/**
 * Define test cases.
 *
 * ```ts
 *  import { TestGroup } from "test-api"
 *
 *  const testSomething: TestGroup = ({ suite, test }) => {
 *    group("a set of tests", () => {
 *      test("a test", assert => {
 *        assert.equals(2 + 3, 5)
 *      })
 *    })
 *  }
 * ```
 */
export type TestGroup = (hook: GroupedTestApi) => void

/**
 * Set of labeled test groups.
 */
export interface TestGroupMap {
  [label: string]: TestGroup
}

/**
 * Abstraction layer for test codes.
 */
export interface TestApi {
  /**
   * Function to define a test case with some methods.
   */
  test: TestCaseDefiner

  /**
   * Define a test suite: group of test cases.
   */
  group(title: string, bodyFn: TestGroup): void

  /**
   * Define a set of test suites.
   */
  runSuiteMap(suites: TestGroupMap): void
}

export interface GroupedTestApi extends TestApi, TestHookApi { }
