'use strict';

const hugMocha = require('./targets/mocha');
const hugTap = require('./targets/tap');

function hugs(huggee) {
  let hugged;

  if (huggee.setup) {
    hugged = hugMocha(huggee);
  } else {
    hugged = hugTap(huggee);
  }

  return hugged;
}

module.exports = hugs;
