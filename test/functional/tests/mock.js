'use strict';

module.exports = function (test) {
  var assert = test.assert;
  var mock = test.mock;

  return function (done) {
    var oUT = {
      method: function () {}
    };
    var mocked = mock(oUT);

    assert.typeOf(mocked.verify, 'function');
    mocked.expects('method').never();
    mocked.verify();
    done();
  };
};
