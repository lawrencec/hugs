'use strict';

module.exports = function (test) {
  var assert = test.assert;
  var spy = test.spy;

  return function (done) {
    var oUT = {
      method: function () {}
    };
    spy(oUT, 'method');
    oUT.method();
    assert.callCount(oUT.method, 1);

    done();
  };
};
