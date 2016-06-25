'use strict';

module.exports = function (test) {
  var assert = test.assert;
  var stub = test.stub;

  return function (done) {
    var oUT = {
      method: function () {}
    };

    stub(oUT, 'method');

    assert.typeOf(oUT.method.throws, 'function');

    done();
  };
};
