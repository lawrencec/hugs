/*eslint-env browser, amd */
'use strict';

function vanillaFactory(hugMocha, hugJasmine) {
  return function hugs(huggee) {
    var hugged;

    if (huggee.setup) {
      hugged = hugMocha(huggee);
    } else {
      hugged = hugJasmine(huggee);
    }

    return hugged;
  };
}

function isValidHuggee(huggee) {
  if (['function','object'].indexOf(typeof huggee) === -1) {
    throw Error('huggee is not valid target. Expected a function or an object');
  }
}

function neopolitanFactory(hugMocha, hugTap, hugAva) {
  return function hugs(huggee) {
    var hugged;

    isValidHuggee(huggee);

    if (huggee.setup) {
      hugged = hugMocha(huggee);
    } else if (huggee.cb) {
      hugged = hugAva(huggee);
    } else {
      hugged = hugTap(huggee);
    }

    return hugged;
  };
}

  // eslint-disable-next-line complexity
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
    root.hugs = vanillaFactory(root.hugMocha, root.hugJasmine);
  }
}(this, neopolitanFactory));
