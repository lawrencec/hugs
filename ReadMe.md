# Hugs [![Build Status](https://travis-ci.org/lawrencec/hugs.svg?branch=master)](https://travis-ci.org/lawrencec/hugs) [![Code Climate](https://img.shields.io/codeclimate/github/lawrencec/hugs.svg)](https://codeclimate.com/github/lawrencec/hugs) [![Test Coverage](https://img.shields.io/codeclimate/coverage/github/lawrencec/hugs.svg)](https://codeclimate.com/github/lawrencec/hugs/coverage) [![Latest Release](https://img.shields.io/github/release/lawrencec/hugs.svg)](https://github.com/lawrencec/hugs/releases)

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
- [mocha](https://mochajs.org/) (browser and node)
- [AVA](https://github.com/avajs/ava) (parallel and serial modes)
- [Jasmine](https://jasmine.github.io) (browser only)

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

However, if you *really* want to type more things, then you still can as Hugs does not mandate you have to use asserts.

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
$> npm run example:browser:mocha # just run browser mocha example
$> npm run example:browser:jasmine # just run browser jasmine example
$> npm run help # see all available npm run commands
```

```
let hugs = require('hugs');

// This example uses Mocha but the require call can be changed to 'tap'
// and without any other changes, the tests will work

let test = hugs(require('mocha'));

let spy = test.spy;
let assert = require('assert');

let oUT = { method: () => { } };

test(
  'a test with a spy',
  function (done) {
    spy(oUT, 'method');

    oUT.method(1, 2);

    assert.callCount(oUT.method, 1); // sinon assertions exposed onto native asserts object
    assert.calledWith(oUT.method, 1, 2);

    done();
  }
);

```

More examples can be seen in the `/examples` directory

#### Browser tests using Karma

There isn't a karma framework for hugs as it is only a wrapper around testing frameworks.
In order to configure karma to use hugs, configure karma as if you were using your framework of choice e.g mocha
and add the following lines to your `files` section *before* your tests files like so:

```
files: [
  'index.js', // thing you are testing
  'node_modules/hugs/src/exporters/sinon.js', // add this
  'node_modules/hugs/src/targets/mocha.js', // add this and replace with tape or ava etc
  'node_modules/hugs/src/index.js',  // add this
  './test/index.js' // your test files.
],
```

See the `/examples` directory for a working example of a karma setup.

### Ending tests

Different frameworks have slightly different mechanisms for ending tests with asynchronous code.

In order to have a test be written in the same way regardless of the test runner used, the `done()` method ends the test correctly depending on the given runner, calling either `t.end()`, `done()` or returning a promise.
For mocha users, this means that all tests need to be written as if it's an async test i.e `done` function is a parameter to the test. The `--async-only` flag for mocha cli is useful here.
AVA uses a different function altogether for async tests called `test.cb`. This meant adding a `cb()` function to the hugs interface which when using mocha or tap is actually the same method as their respective `test()` method.


| Type    | Lifecycle | async (callback)                    | async (promise)                            |
|---------|-----------|-------------------------------------|--------------------------------------------|
| AVA     | signature | `test.cb(’title’, (t) => {});`      | `test(‘title’, () => {});`                 |
| AVA     | end       | `t.end();`                          | `return promise;`                          |
| Mocha   | signature | `test(’title’, (done) => {});`      | `test(‘title’, () => {});`                 |
| Mocha   | end       | `done();`                           | `return promise;`                          |
| Tap     | signature | `test(’title’, (t) => {});`         | `test(‘title’, (t) => {});`                |
| Tap     | end       | `t.end();`                          | `return promise;`                          |
| Hugs    | signature | `test.cb('title', (done) => {});`      | `test('title', () => {});`                 |
| Hugs    | end       | `done();`                           | `return promise;`                          |


## API

The test object returned from a `hugs()` call has the following API:

- afterEach - Lifecycle method to register functions to execute after each test function
- assert - assertions object. Exposes sinon assertions `test.assert.callCount(foo, 1)`)
- beforeEach - Lifecycle method to register functions to execute before each test function
- createStubInstance - Sinon method for stubbing out constructors.
- done - ends the test for non Promise tests. Can be passed `arguments` of the test callback or a done argument if specified in the test signature.
- match - Sinon's matcher api
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

To run functional, mocha and tap (node), as well as mocha and jasmine (browser) tests:

```
npm run test:functional
```

To run all browser functional tests only:

```
npm run test:browser
```

More options available; see `npm run help`

## Some things you need to know about hugs
- Nested hugs (tests) are not currently supported which isn't necessarily a bad thing. Tests files can [become unwieldly with deeply nested tests](https://www.briefs.fm/3-minutes-with-kent/27).
- hugs are a superpower!



