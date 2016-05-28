# Hugs [![Build Status](https://drone.io/github.com/lawrencec/hugs/status.png)](https://drone.io/github.com/lawrencec/hugs/latest) [![Code Climate](https://codeclimate.com/github/lawrencec/hugs/badges/gpa.svg)](https://codeclimate.com/github/lawrencec/hugs) [![Test Coverage](https://codeclimate.com/github/lawrencec/hugs/badges/coverage.svg)](https://codeclimate.com/github/lawrencec/hugs/coverage)

 ![Boy hugging piñata](https://i.giphy.com/SKElG8dQWhPdS.gif)

Are you fatigued by any of the following?

- Having to recreate your test environment each time you start up a new project
- Indecision as to what assertion library to use?
- Wanting to try out a different test framework but bored of learning yet another API that's almost the same but not quite

If you are, then you need Hugs!

Hugs is a module that allows you to write your nodejs tests in exactly the same way regardless of which test framework you choose to use.
It does this by *wrapping* those frameworks with a consistent API.

Currently, Hugs supports the following test frameworks:

- [node-tap](http://www.node-tap.org/)
- [mocha](https://mochajs.org/)

Soon, perhaps, with the following too

- [AVA](https://github.com/avajs/ava)

Sinon spies, stubs and mocks are created using sinon's sandbox before every test (and torn down afterwards).

Hugs has only one opinion and that is that C-style asserts should be used for assertions.

```
assert.calledWith(anObject.aMethod, 'foo');
```

is better than

```
expect(anObject.aMethod).to.have.been.calledWith("foo");
```

Less typing means more time to hold the hand of your favourite person/pet/piñata instead!

However, if you *really* want to type more things, then you can as the `chai` object is publicly exposed.

## Why?

Working on multiple projects and multiple teams, each with a different preference for a test runner (Jasmine or Mocha or TAP) and assertion framework (assert, expect or should) as well as test double frameworks (Jasmine or sinon), I got fatigued off with trying to remember which methods I should be calling.
All I want to do is set up a test and check that a value is equal to something. I was also bored with every new project I start to have to set up my test setup again. With hugs, I only need to install hugs and my testrunner e.g mocha.


## Install

```
npm install hugs
```

## Usage

Below is an example snippet but see `/examples` folder. It needs to be run with the corresponding test runner for the chosen framework.

```
$> cd examples
$> npm install
$> npm run examples # runs examples under both mocha and tap
$> npm run example:mocha # just run mocha example
$> npm run example:tap # just run tap example
```

```
let hugs = require('hugs');

// This example uses Mocha but the require call can be changed to 'tap'
// and without any other changes, the tests will work

let test = hugs(require('mocha'));

let spy = test.spy;
let assert = test.assert;

let oUT = { method: () => { } };

test(
  'a test with a spy',
  function (done) {
    spy(oUT, 'method');

    oUT.method(1, 2);

    assert.callCount(oUT.method, 1);
    assert.calledWith(oUT.method, 1, 2);

    done();
  }
);

```

More examples can be seen in the `/examples` directory

### Ending tests

Different frameworks have slightly different mechanisms for ending tests with asynchronous code.

| Type    | Lifecycle | async (callback)                    | async (promise)                            |
|-        |-          |-                                    |-:                                          |
| Mocha   | signature | `test(’title’, (done) => {});`      | `test(‘title’, () => {});`                 |
| Mocha   | end       | `done();`                           | `return promise;`                          |
| Tap     | signature | `test(’title’, (t) => {});`         | `test(‘title’, (t) => {});`                |
| Tap     | end       | `t.end();`                          | `return promise;`                          |
| Hugs    | signature | `test('title', (done) => {});`      | `test('title', () => {});`                 |
| Hugs    | end       | `done();`                           | `return promise;`                          |

In order to have a test be written in the same way regardless of the test runner used, the `done()` method ends the test correctly depending on the given runner, calling either `t.end()`, `done()` or returning a promise.
For mocha users, this means that all tests need to be written as if it's an async test i.e `done` function is a parameter to the test. The `--async-only` flag for mocha cli is useful here.

## API

The test object returned from a `hugs()` call has the following API:

- afterEach - Lifecycle method to register functions to execute after each test function
- assert - assertions object. Exposes sinon and chai assertions `test.assert.callCount(foo, 1)`)
- beforeEach - Lifecycle method to register functions to execute before each test function
- chai - Chai object.
- done - ends the test for non Promise tests. Can be passed `arguments` of the test callback or a done argument if specified in the test signature.  
- mock - sinon mock (sandboxed for each test)
- only (Mocha) - Runs a single test `test.only('a test', function(t){});`
- spy - sinon spy (sandboxed for each test)
- stub - sinon stub (sandboxed for each test)
- test -  test method

## Tests

To run unit tests:

```
npm run test:unit
```

To run functional (mocha and tap) tests:

```
npm run test:functional
```

## Some things you need to know about hugs
- Nested hugs (tests) are not currently supported which isn't necessarily a bad thing. Tests files can become unwieldly with deeply nested tests.
- hugs are a superpower!



