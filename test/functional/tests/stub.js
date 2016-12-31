'use strict';

module.exports = function (test) {
  var assert = require('assert');
  var stub = test.stub;

  return function (done) {
    var oUT = {
      method: function () {}
    };

    stub(oUT, 'method');

    assert.equal(typeof oUT.method.throws, 'function');

    done();
  };
};
