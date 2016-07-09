'use strict';

module.exports = function (test) {
  var assert = test.assert;
  var chai = test.chai;
  var mock = test.mock;
  var spy = test.spy;
  var stub = test.stub;

  return function (done) {
    assert.typeOf(assert, 'function');
    assert.typeOf(chai, 'object');
    assert.typeOf(mock, 'function');
    assert.typeOf(spy, 'function');
    assert.typeOf(stub, 'function');

    done();
  };
};
