/*eslint-env browser, amd */

'use strict';

(function (root, factory) {
  /* istanbul ignore next */
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.hugs = factory();
  }
}(this, function () {
  return function hugs(huggee) {
    var hugged;

    if (huggee.setup) {
      hugged = hugMocha(huggee);
    }

    return hugged;
  };
}));
