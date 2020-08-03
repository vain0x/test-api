# Test API for TypeScript

Abstraction layer of test codes for decoupling

## Install

(TODO: Publish to NPM.)

## Usage

Basic usage is similar to [mocha of TDD flavor](https://mochajs.org/#tdd).

```ts
import { TestSuite } from "test-api" // Just for type definitions

const testSomething: TestSuite = ({ test }): void => {
  test("add", assert => {
    assert.eq(40 + 2, 42)
  })
}
```

Some differences:

- Write your test code as *just a function* taking an object that provides API for testing
    - and then execute these functions
- Functions are provided via argument rather than globals or imports

### Execution


TBD: Execute the function with some runner's api.

## Suite: Group of tests

`suite` forms a group of test cases.

```ts
import { TestSuite } from "test-api"

const testArithmetic: TestSuite = ({ suite, test }): void => {
  suite("arithmetic operation", () => {
    test("add", assert => {
      assert.eq(40 + 2, 42)
    })

    test("subtract", assert => {
      assert.eq(44 - 2, 42)
    })
  })
}
```

## Hook: `before`/`after`

```ts
import { TestSuite } from "test-api"

const testSomething: TestSuite = ({ suite, test }): void => {
  suite("test using file system", hook => {
    hook.before(() => {
      createTemporaryDirectory()
    })

    hook.after(() => {
      deleteTemporaryDirectory()
    })

    test("write files", assert => {
      // perhaps create files in the temporary directory
    })
  })
}
```

And:

- `beforeEach`
- `afterEach`

## Implementation

[src/index.ts](src/index.ts)

## Motivation

- Decouple test codes from test runner framework (mocha/jest/etc.)
    - So that you can switch one to another easily
- Decouple test codes from assertion libraries
    - So that you can add/remove stronger assert functions (e.g. so-called power assert) instead of directly use `assert` module from Node.js

And specific to some runners:

- Prevent global namespace pollution
    - Type definitions of some runners declare global functions such as `test`
