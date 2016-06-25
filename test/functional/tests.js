'use strict';
var libName = process.env['HUGS_LIB'];
var expectedLibs = ['ava', 'mocha', 'tap'];

if (expectedLibs.indexOf(libName) === -1) {
  // eslint-disable-next-line
  console.log(libName + ' not found in expected list of test libraries:  ' + expectedLibs.join(', '));
  process.exit(0);
}

var hugs = require('../../src/index');
var apiTests = require('./tests/api');
var assertTests = require('./tests/asserts');
var promiseTest = require('./tests/promise');
var asyncTest = require('./tests/async');
var mockTest = require('./tests/mock');
var spyTest = require('./tests/spy');
var stubTest = require('./tests/stub');

var test = hugs(require(libName));
test('asserts', assertTests(test));
test('api', apiTests(test));
test('spy', spyTest(test));
test('stub', stubTest(test));
test('mock', mockTest(test));
test('promise', promiseTest(test));
test.cb('async', asyncTest(test));

