'use strict';

module.exports = function (test) {
  var assert = require('assert');

  return function (done) {
    var val = true;

    setTimeout(function () {
      assert.equal(val, true);

      done();
    }, 50);
  };
};
