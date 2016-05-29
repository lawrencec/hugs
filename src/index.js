'use strict';

const hugMocha = require('./targets/mocha');
const hugTap = require('./targets/tap');
const hugAva = require('./targets/ava');

function hugs(huggee) {
  let hugged;

  if (huggee.setup) {
    hugged = hugMocha(huggee);
  } else if (huggee.cb) {
    hugged = hugAva(huggee);
  } else {
    hugged = hugTap(huggee);
  }

  return hugged;
}

module.exports = hugs;
