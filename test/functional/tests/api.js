'use strict';

module.exports = (test) => {
  const assert = test.assert;
  const chai = test.chai;
  const mock = test.mock;
  const spy = test.spy;
  const stub = test.stub;

  return (done) => {
    assert.typeOf(assert, 'function');
    assert.typeOf(chai, 'object');
    assert.typeOf(mock, 'function');
    assert.typeOf(spy, 'function');
    assert.typeOf(stub, 'function');

    done();
  };
};
