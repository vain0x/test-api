import { createJestTestApi } from "test-api-ts-jest"
import { TestGroup } from "test-api-ts"

// Test codes. (Runner-agnostic.)

const testOperation: TestGroup = ({ test }) => {
  test("add", assert => {
    assert.equals(2 + 3, 5)
  })
}

// Execute test codes.

createJestTestApi().runSuiteMap({
  testOperation,
})
