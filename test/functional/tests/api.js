'use strict';

module.exports = function (test) {
  var assert = require('assert');
  var mock = test.mock;
  var spy = test.spy;
  var stub = test.stub;
  var match = test.match;
  var createStubInstance = test.createStubInstance;

  return function (done) {
    assert.equal(typeof assert, 'function');
    assert.equal(typeof mock, 'function');
    assert.equal(typeof spy, 'function');
    assert.equal(typeof stub, 'function');
    assert.equal(typeof match, 'function');
    assert.equal(typeof createStubInstance, 'function');

    done();
  };
};
