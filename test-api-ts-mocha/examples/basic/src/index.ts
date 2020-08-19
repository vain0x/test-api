import { createMochaTestApi } from "test-api-ts-mocha"
import { TestGroup } from "test-api-ts"

// Test codes.

const testOperation: TestGroup = ({ test }) => {
  test("add", assert => {
    assert.equals(2 + 3, 5)
  })
}

// Execute test codes.

createMochaTestApi().runSuiteMap({
  testOperation,
})
