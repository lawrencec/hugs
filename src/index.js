/*eslint-env browser, amd */
'use strict';

(function (root, factory) {
  /* istanbul ignore next */
  if (typeof define === 'function' && define.amd) {
    define(
      [
        './targets/mocha',
        './targets/tap',
        './targets/ava'
      ],
      factory
    );
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(
      require('./targets/mocha'),
      require('./targets/tap'),
      require('./targets/ava')
    );
  } else {
    root.hugs = factory(hugMocha);
  }
}(this, function (hugMocha, hugTap, hugAva) {
  return function hugs(huggee) {
    var hugged;

    if (huggee.setup) {
      hugged = hugMocha(huggee);
    } else if (huggee.cb) {
      hugged = hugAva(huggee);
    } else {
      hugged = hugTap(huggee);
    }

    return hugged;
  }
}));
