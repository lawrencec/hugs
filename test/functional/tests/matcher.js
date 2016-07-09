'use strict';

module.exports = function (test) {
  var assert = test.assert;
  var spy = test.spy;

  return function (done) {
    var oUT = {
      method: function () {}
    };
    spy(oUT, 'method');
    oUT.method('aString');

    assert.calledWith(oUT.method, test.match.string);

    done();
  };
};
