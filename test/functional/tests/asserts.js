'use strict';

module.exports = function (test) {
  var assert = test.assert;

  return function (done) {
    var oUT = {
      foo: 1,
      bar: 2
    };

    assert.equal(Object.keys(oUT).length, 2);

    done();
  };
};
