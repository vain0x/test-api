import { createMochaTestApi } from "ts-test-api-mocha"
import { TestGroup } from "ts-test-api"

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
