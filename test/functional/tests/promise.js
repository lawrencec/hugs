'use strict';

module.exports = function (test) {
  var assert = test.assert;
  var spy = test.spy;

  return function () {
    var oUT = {
      method: function () {}
    };
    spy(oUT, 'method');

    return Promise.resolve(2 + 2)
      .then(function (result) {
        assert.equal(result, 4);
        assert.callCount(oUT.method, 0);
      });
  };
};
