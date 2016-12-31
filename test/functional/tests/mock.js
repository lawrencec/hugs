'use strict';

module.exports = function (test) {
  var assert = require('assert');
  var mock = test.mock;

  return function (done) {
    var oUT = {
      method: function () {}
    };
    var mocked = mock(oUT);

    assert.equal(typeof mocked.verify, 'function');
    mocked.expects('method').never();
    mocked.verify();
    done();
  };
};
