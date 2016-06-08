'use strict';
const libName = process.env['HUGS_LIB'];
const expectedLibs = ['ava', 'mocha', 'tap'];

if (expectedLibs.indexOf(libName) === -1) {
  // eslint-disable-next-line
  console.log(`"${libName}" not found in expected list of test libraries:  ${expectedLibs.join(', ')}`);
  process.exit(0);
}

const hugs = require('../../src/index');
const apiTests = require('./tests/api');
const assertTests = require('./tests/asserts');
const promiseTest = require('./tests/promise');
const asyncTest = require('./tests/async');
const mockTest = require('./tests/mock');
const spyTest = require('./tests/spy');
const stubTest = require('./tests/stub');

const test = hugs(require(libName));

test('asserts', assertTests(test));
test('api', apiTests(test));
test('spy', spyTest(test));
test('stub', stubTest(test));
test('mock', mockTest(test));
test('promise', promiseTest(test));
test.cb('async', asyncTest(test));

